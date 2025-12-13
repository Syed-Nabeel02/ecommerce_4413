package com.ecommerce.project.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.ecommerce.project.DAO.CartDAO;
import com.ecommerce.project.DAO.CategoryDAO;
import com.ecommerce.project.DAO.ProductDAO;
import com.ecommerce.project.DTO.CartDTO;
import com.ecommerce.project.DTO.ProductDTO;
import com.ecommerce.project.DTO.ProductResponse;
import com.ecommerce.project.errorHandler.APIException;
import com.ecommerce.project.errorHandler.ResourceNotFoundException;
import com.ecommerce.project.helper.AuthHelper;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.service.Interface.ICartService;
import com.ecommerce.project.service.Interface.FileService;
import com.ecommerce.project.service.Interface.IProductService;

@Service
public class IProductServiceImpl implements IProductService {

    private final CartDAO cartDAO;
    private final CategoryDAO categoryDAO;
    private final ProductDAO productDAO;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final AuthHelper authHelper;
    private final ICartService cartService;

    @Value("${project.image}")
    private String imagePath;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    public IProductServiceImpl(CartDAO cartDAO, CategoryDAO categoryDAO, ProductDAO productDAO,
                               ModelMapper modelMapper, FileService fileService, AuthHelper authHelper, ICartService cartService) {
        this.cartDAO = cartDAO;
        this.categoryDAO = categoryDAO;
        this.productDAO = productDAO;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.authHelper = authHelper;
        this.cartService = cartService;
    }

    @Override
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO) {
        Category targetCategory = fetchCategoryOrThrowException(categoryId);
        validateProductNameNotExists(targetCategory, productDTO.getProductName());

        Product newProductEntity = createNewProductEntity(productDTO, targetCategory);
        Product persistedProduct = productDAO.save(newProductEntity);

        return convertEntityToDTO(persistedProduct);
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category) {
        Sort sortingCriteria = buildSortCriteria(sortBy, sortOrder);
        Pageable paginationConfig = PageRequest.of(pageNumber, pageSize, sortingCriteria);

        Specification<Product> filterSpecification = buildProductFilterSpecification(keyword, category);
        Page<Product> paginatedProducts = productDAO.findAll(filterSpecification, paginationConfig);

        List<ProductDTO> productDataList = transformProductsToDTO(paginatedProducts.getContent());
        return buildProductResponse(paginatedProducts, productDataList);
    }

    @Override
    public ProductResponse getAllProductsForAdmin(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortingCriteria = buildSortCriteria(sortBy, sortOrder);
        Pageable paginationConfig = PageRequest.of(pageNumber, pageSize, sortingCriteria);
        Page<Product> paginatedProducts = productDAO.findAll(paginationConfig);

        List<ProductDTO> productDataList = transformProductsToDTO(paginatedProducts.getContent());
        return buildProductResponse(paginatedProducts, productDataList);
    }


    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Category targetCategory = fetchCategoryOrThrowException(categoryId);

        Sort sortingCriteria = buildSortCriteria(sortBy, sortOrder);
        Pageable paginationConfig = PageRequest.of(pageNumber, pageSize, sortingCriteria);
        Page<Product> paginatedProducts = productDAO.findByCategoryOrderByPriceAsc(targetCategory, paginationConfig);

        List<Product> productList = paginatedProducts.getContent();
        validateProductsExist(productList, targetCategory.getCategoryName());

        List<ProductDTO> productDataList = transformProductsToDTO(productList);
        return buildProductResponse(paginatedProducts, productDataList);
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortingCriteria = buildSortCriteria(sortBy, sortOrder);
        Pageable paginationConfig = PageRequest.of(pageNumber, pageSize, sortingCriteria);
        Page<Product> paginatedProducts = productDAO.findByProductNameLikeIgnoreCase('%' + keyword + '%', paginationConfig);

        List<Product> productList = paginatedProducts.getContent();
        validateProductsExistForKeyword(productList, keyword);

        List<ProductDTO> productDataList = transformProductsToDTO(productList);
        return buildProductResponse(paginatedProducts, productDataList);
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProductEntity = fetchProductOrThrowException(productId);
        updateProductDetails(existingProductEntity, productDTO);
        Product persistedProduct = productDAO.save(existingProductEntity);

        List<Cart> affectedCarts = cartDAO.retrieveCartsByProduct(productId);
        notifyCartsOfProductUpdate(affectedCarts, productId);

        return convertEntityToDTO(persistedProduct);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product productToDelete = fetchProductOrThrowException(productId);

        List<Cart> affectedCarts = cartDAO.retrieveCartsByProduct(productId);
        removeProductFromAllCarts(affectedCarts, productId);

        productDAO.delete(productToDelete);
        return convertEntityToDTO(productToDelete);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product existingProductEntity = fetchProductOrThrowException(productId);

        String uploadedFileName = fileService.uploadImage(imagePath, image);
        existingProductEntity.setImage(uploadedFileName);

        Product persistedProduct = productDAO.save(existingProductEntity);
        return convertEntityToDTO(persistedProduct);
    }

    private Category fetchCategoryOrThrowException(Long categoryId) {
        return categoryDAO.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    }

    private Product fetchProductOrThrowException(Long productId) {
        return productDAO.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }

    private void validateProductNameNotExists(Category targetCategory, String productName) {
        boolean productExists = targetCategory.getProducts().stream()
                .anyMatch(product -> product.getProductName().equals(productName));

        if (productExists) {
            throw new APIException("Product already exist!!");
        }
    }

    private void validateProductsExist(List<Product> productList, String categoryName) {
        if (productList.isEmpty()) {
            throw new APIException(categoryName + " category does not have any products");
        }
    }

    private void validateProductsExistForKeyword(List<Product> productList, String keyword) {
        if (productList.isEmpty()) {
            throw new APIException("Products not found with keyword: " + keyword);
        }
    }

    private Product createNewProductEntity(ProductDTO productDTO, Category targetCategory) {
        Product newProductEntity = modelMapper.map(productDTO, Product.class);
        newProductEntity.setImage("default.png");
        newProductEntity.setCategory(targetCategory);
        newProductEntity.setUser(authHelper.loggedInUser());

        return newProductEntity;
    }

    private Sort buildSortCriteria(String sortBy, String sortOrder) {
        return sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
    }

    private Specification<Product> buildProductFilterSpecification(String keyword, String category) {
        Specification<Product> filterSpecification = Specification.where(
                (root, query, criteriaBuilder) -> criteriaBuilder.conjunction());

        if (keyword != null && !keyword.isEmpty()) {
            filterSpecification = filterSpecification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%"));
        }

        if (category != null && !category.isEmpty()) {
            filterSpecification = filterSpecification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("category").get("categoryName"), category));
        }

        return filterSpecification;
    }

    private List<ProductDTO> transformProductsToDTO(List<Product> products) {
        return products.stream()
                .map(productEntity -> {
                    ProductDTO productData = modelMapper.map(productEntity, ProductDTO.class);
                    productData.setImage(constructImageUrl(productEntity.getImage()));
                    return productData;
                })
                .toList();
    }

    private ProductDTO convertEntityToDTO(Product product) {
        return modelMapper.map(product, ProductDTO.class);
    }

    private String constructImageUrl(String imageName) {
        // If image is already a full URL (from Cloudinary), return as-is
        if (imageName != null && (imageName.startsWith("http://") || imageName.startsWith("https://"))) {
            return imageName;
        }
        // Otherwise, construct URL for local/legacy images
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }

    private ProductResponse buildProductResponse(Page<Product> paginatedProducts, List<ProductDTO> productDataList) {
        ProductResponse responsePayload = new ProductResponse();
        responsePayload.setContent(productDataList);
        responsePayload.setPageNumber(paginatedProducts.getNumber());
        responsePayload.setPageSize(paginatedProducts.getSize());
        responsePayload.setTotalElements(paginatedProducts.getTotalElements());
        responsePayload.setTotalPages(paginatedProducts.getTotalPages());
        responsePayload.setLastPage(paginatedProducts.isLast());
        return responsePayload;
    }

    private void updateProductDetails(Product existingProduct, ProductDTO productDTO) {
        Product updatedProductData = modelMapper.map(productDTO, Product.class);
        existingProduct.setProductName(updatedProductData.getProductName());
        existingProduct.setDescription(updatedProductData.getDescription());
        existingProduct.setQuantity(updatedProductData.getQuantity());
        existingProduct.setPrice(updatedProductData.getPrice());
    }

    private void notifyCartsOfProductUpdate(List<Cart> affectedCarts, Long productId) {
        affectedCarts.forEach(shoppingCart -> cartService.updateProductInCarts(shoppingCart.getCartId(), productId));
    }

    private void removeProductFromAllCarts(List<Cart> affectedCarts, Long productId) {
        affectedCarts.forEach(shoppingCart -> cartService.deleteProductFromCart(shoppingCart.getCartId(), productId));
    }
}
