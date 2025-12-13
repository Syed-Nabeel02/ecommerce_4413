/**
 * HomeView.jsx
 *
 * DESCRIPTION:
 * The main homepage view component that users see when they first visit the website.
 * Displays a hero carousel with promotional banners and featured products below.
 *
 * USED IN:
 * - App.jsx (route: '/')
 *
 * KEY FEATURES:
 * - Hero carousel with auto-playing promotional slides
 * - Featured products section showing first 4 products from catalog
 * - Error handling with user-friendly error messages
 * - Automatic product loading when component mounts
 * - Responsive grid layout for products (1-4 columns based on screen size)
 * - Loading state management via Redux
 *
 * DEPENDENCIES:
 * - react-redux (useDispatch, useSelector for state management)
 * - Redux store actions (loadCatalogItems)
 * - HeroCarousel component (promotional banner slideshow)
 * - ItemCard component (will be renamed to ProductCard later)
 * - react-icons/fa (FaExclamationTriangle for error display)
 */

import { useDispatch, useSelector } from "react-redux";
import HeroCarousel from "./components/HeroCarousel";
import { useEffect } from "react";
import { loadCatalogItems } from "../../store/actions";
import ProductCard from "../../components/ui/layout/ProductCard";
import { FaExclamationTriangle } from "react-icons/fa";

/**
 * HomeView Component
 *
 * Main landing page of the e-commerce application.
 * Loads product catalog on mount and displays hero carousel with featured products.
 *
 * @returns {JSX.Element} Home page with carousel and product grid
 *
 * @example
 * // In App.jsx routing:
 * <Route path='/' element={<HomeView />}/>
 */
const HomeView = () => {
    // Get dispatch function to trigger Redux actions
    const dispatch = useDispatch();

    // Get catalog items (products) from Redux store
    // catalogItems is an array of product objects from the backend API
    const {catalogItems} = useSelector((state) => state.catalog);

    // Get any error messages from the error slice
    // If API call fails, errorMessage will contain the error text
    const { errorMessage } = useSelector(
        (state) => state.errors
    );

    // useEffect runs when component first mounts
    // This is where we fetch the product catalog from the backend
    useEffect(() => {
        // Dispatch action to load catalog items from API
        // This action is defined in store/actions/index.js
        // It makes an API call and updates the Redux store with product data
        dispatch(loadCatalogItems());
    }, [dispatch]); // Dependency array: only run when dispatch changes (which is never)

    return (
        // Main container with responsive horizontal padding
        // lg:px-14 = 56px padding on large screens
        // sm:px-8 = 32px padding on small screens
        // px-4 = 16px padding on mobile
        <div className="lg:px-14 sm:px-8 px-4">

            {/* Hero Carousel Section */}
            {/* py-6 = vertical padding of 24px */}
            <div className="py-6">
                {/* New carousel component using React Slick */}
                {/* Replaces the old MainBanner component that used Swiper */}
                <HeroCarousel />
            </div>

            {/* Products Section */}
            <div className="py-5">

                {/* Section Header */}
                {/* Centered title and subtitle introducing the products */}
                <div className="flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-slate-800 text-4xl font-bold"> Products</h1>
                        <span className="text-slate-700">
                            Discover our handpicked selection of top-rated items just for you!
                        </span>
                </div>

                {/* Conditional rendering: show error OR show products */}
                {/* If there's an error message, display it instead of products */}
                {errorMessage ? (
                    // Error state display
                    // Shows warning icon and error message centered on screen
                    <div className="flex justify-center items-center h-[200px]">
                        <FaExclamationTriangle className="text-slate-800 text-3xl mr-2"/>
                        <span className="text-slate-800 text-lg font-medium">
                            {errorMessage}
                        </span>
                    </div>
                ) : (
                    // Product grid display (when no errors)
                    // Responsive grid that adjusts columns based on screen size:
                    // Mobile: 1 column (default)
                    // sm: 2 columns (640px and up)
                    // lg: 3 columns (1024px and up)
                    // 2xl: 4 columns (1536px and up)
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                       {/* Display first 4 products from catalog */}
                       {/* && checks if catalogItems exists before trying to use it */}
                       {/* .slice(0,4) takes only the first 4 items */}
                       {/* .map() creates an ItemCard for each product */}
                       {catalogItems &&
                       catalogItems?.slice(0,4)
                                .map((item, i) =>
                                    // Spread operator {...item} passes all product properties as props
                                    // This includes: productId, productName, price, image, etc.
                                    <ProductCard key={i} {...item} />
                        )}
                    </div>
                    )}
            </div>
        </div>
    )
}

export default HomeView;
