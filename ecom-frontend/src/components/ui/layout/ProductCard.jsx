// javascript
import { useState } from 'react';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import ProductQuickView from '../modals/ProductQuickView';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../../store/actions';
import toast from 'react-hot-toast';

const ProductCard = ({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        about = false,
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addItemToCart(cartItems, 1, toast));
    };

    return (
        <div
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Stock Badge */}
            {!isAvailable && (
                <div className="absolute top-4 right-4 z-10 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Out of Stock
                </div>
            )}

            {/* Image Container - Taller */}
            <div
                onClick={() => {
                    handleProductView({
                        id: productId,
                        productName,
                        image,
                        description,
                        quantity,
                        price,
                    });
                }}
                className="relative w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
            >
                <img
                    className="max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    src={image}
                    alt={productName}
                />

                {/* Quick View Overlay */}
                {!about && (
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                            <FaEye />
                            Quick View
                        </button>
                    </div>
                )}
            </div>

            {/* Content - Smaller */}
            <div className="p-4">
                <h2
                    onClick={() => {
                        handleProductView({
                            id: productId,
                            productName,
                            image,
                            description,
                            quantity,
                            price,
                        });
                    }}
                    className="text-base font-bold mb-1 cursor-pointer text-gray-800 hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem]"
                >
                    {productName}
                </h2>

                <p className="text-gray-500 text-xs mb-3 line-clamp-1">
                    {description}
                </p>

                {/* Stock Info */}
                <div className="mb-3">
                    {isAvailable ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600">
                                {quantity} in stock
                            </span>
                            {quantity < 10 && (
                                <span className="text-xs text-red-600 font-semibold">
                                    • Hurry up!
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-red-600 font-semibold">Unavailable</span>
                        </div>
                    )}
                </div>

                {!about && (
                    <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                        {/* Price */}
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-gray-800">
                                ${Number(price).toFixed(2)}
                            </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            disabled={!isAvailable || btnLoader}
                            onClick={() =>
                                addToCartHandler({
                                    image,
                                    productName,
                                    description,
                                    price,
                                    productId,
                                    quantity,
                                })
                            }
                            className={`${
                                isAvailable
                                    ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                                    : "bg-gray-300 cursor-not-allowed"
                            } text-white py-2 px-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                        >
                            <FaShoppingCart className="text-base" />
                            <span className="hidden sm:inline text-sm">
                                {isAvailable ? "Add" : "Unavailable"}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <ProductQuickView
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    );
};

export default ProductCard;
