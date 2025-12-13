/**
 * ProductsView.jsx
 * Product listing page with filter and pagination.
 * Uses: useProductFilter, ProductFilter, ProductCard, Paginations
 */

import { FaExclamationTriangle } from 'react-icons/fa';
import ProductCard from '../../components/ui/layout/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadCategoryList } from '../../store/actions';
import ProductFilter from './components/ProductFilter';
import useProductFilter from '../../hooks/useProductFilter';
import PaginationControls from '../../components/ui/layout/PaginationControls';

const ProductsView = () => {
    const { errorMessage } = useSelector((state) => state.errors);
    const {catalogItems, categoryList, pageInfo} = useSelector((state) => state.catalog);
    const dispatch = useDispatch();

    // Custom hook handles URL params and fetches filtered products
    useProductFilter();

    useEffect(() => {
        dispatch(loadCategoryList());
    }, [dispatch]);

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
            <ProductFilter categories={categoryList ? categoryList : []}/>

            {errorMessage ? (
                <div className="flex justify-center items-center h-[200px]">
                    <FaExclamationTriangle className="text-slate-800 text-3xl mr-2"/>
                    <span className="text-slate-800 text-lg font-medium">
                        {errorMessage}
                    </span>
                </div>
            ) : (
                <div className="min-h-[700px]">
                    {/* Product grid - responsive columns */}
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                       {catalogItems &&
                        catalogItems.map((item, i) => <ProductCard key={i} {...item} />
                        )}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center pt-10">
                        <PaginationControls
                            numberOfPage = {pageInfo?.totalPages}
                            totalProducts = {pageInfo?.totalElements}/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductsView;
