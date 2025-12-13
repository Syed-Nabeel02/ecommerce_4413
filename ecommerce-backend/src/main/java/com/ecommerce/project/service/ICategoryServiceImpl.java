package com.ecommerce.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ecommerce.project.DAO.CategoryDAO;
import com.ecommerce.project.DTO.CategoryDTO;
import com.ecommerce.project.DTO.CategoryResponse;
import com.ecommerce.project.errorHandler.APIException;
import com.ecommerce.project.errorHandler.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.service.Interface.ICategoryService;

@Service
public class ICategoryServiceImpl implements ICategoryService {

    private final CategoryDAO categoryDAO;
    private final ModelMapper modelMapper;

    public ICategoryServiceImpl(CategoryDAO categoryDAO, ModelMapper modelMapper) {
        this.categoryDAO = categoryDAO;
        this.modelMapper = modelMapper;
    }

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortingCriteria = buildSortCriteria(sortBy, sortOrder);
        Pageable paginationDetails = PageRequest.of(pageNumber, pageSize, sortingCriteria);
        Page<Category> paginatedCategories = categoryDAO.findAll(paginationDetails);

        List<Category> categoriesList = paginatedCategories.getContent();
        validateCategoriesExist(categoriesList);

        List<CategoryDTO> categoryDataList = transformCategoriesToDTO(categoriesList);
        return buildCategoryResponse(paginatedCategories, categoryDataList);
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category newCategoryEntity = convertDTOToEntity(categoryDTO);
        validateCategoryNameNotExists(newCategoryEntity.getCategoryName());

        Category persistedCategory = categoryDAO.save(newCategoryEntity);
        return convertEntityToDTO(persistedCategory);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category categoryToDelete = fetchCategoryOrThrowException(categoryId);
        categoryDAO.delete(categoryToDelete);
        return convertEntityToDTO(categoryToDelete);
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {
        Category existingCategory = fetchCategoryOrThrowException(categoryId);
        Category updatedCategoryData = convertDTOToEntity(categoryDTO);
        updatedCategoryData.setCategoryId(categoryId);

        Category modifiedCategory = categoryDAO.save(updatedCategoryData);
        return convertEntityToDTO(modifiedCategory);
    }

    private Sort buildSortCriteria(String sortBy, String sortOrder) {
        return sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
    }

    private void validateCategoriesExist(List<Category> categoriesList) {
        if (categoriesList.isEmpty()) {
            throw new APIException("No category created till now.");
        }
    }

    private List<CategoryDTO> transformCategoriesToDTO(List<Category> categories) {
        return categories.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }

    private CategoryResponse buildCategoryResponse(Page<Category> paginatedCategories, List<CategoryDTO> categoryDataList) {
        CategoryResponse responsePayload = new CategoryResponse();
        responsePayload.setContent(categoryDataList);
        responsePayload.setPageNumber(paginatedCategories.getNumber());
        responsePayload.setPageSize(paginatedCategories.getSize());
        responsePayload.setTotalElements(paginatedCategories.getTotalElements());
        responsePayload.setTotalPages(paginatedCategories.getTotalPages());
        responsePayload.setLastPage(paginatedCategories.isLast());
        return responsePayload;
    }

    private Category convertDTOToEntity(CategoryDTO categoryDTO) {
        return modelMapper.map(categoryDTO, Category.class);
    }

    private CategoryDTO convertEntityToDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    private void validateCategoryNameNotExists(String categoryName) {
        Category existingCategoryInDb = categoryDAO.findByCategoryName(categoryName);
        if (existingCategoryInDb != null) {
            throw new APIException("Category with the name " + categoryName + " already exists !!!");
        }
    }

    private Category fetchCategoryOrThrowException(Long categoryId) {
        return categoryDAO.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    }
}
