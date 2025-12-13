/**
 * ProductManagementView.jsx
 * Admin product management page with TanStack Table.
 * CRUD operations for products using new DataTable component.
 */

import React, { useState } from 'react'
import { MdAddShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { FaBoxOpen } from 'react-icons/fa';
import { getProductTableColumns } from '../../utilities/tableConfigurations/productTableConfig';
import { useDashboardProductFilter } from '../../hooks/useProductFilter';
import BaseModal from '../../components/ui/modals/BaseModal';
import AddProductForm from './components/products/AddProductForm';
import ConfirmDeleteDialog from '../../components/ui/modals/ConfirmDeleteDialog';
import { removeCatalogItem } from '../../store/actions';
import toast from 'react-hot-toast';
import ImageUploadForm from './components/products/ImageUploadForm';
import ProductQuickView from '../../components/ui/modals/ProductQuickView';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DataTable from '../../components/ui/layout/DataTable';

const ProductManagementView = () => {
  const {catalogItems, pageInfo} = useSelector((state) => state.catalog);
  const [currentPage, setCurrentPage] = useState(pageInfo?.pageNumber + 1 || 1);
  const dispatch = useDispatch();

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState('');
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [openImageUploadModal, setOpenImageUploadModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  // Custom hook for filtering
  useDashboardProductFilter();

  // Transform data for TanStack Table
  const tableData = catalogItems?.map((item) => ({
    id: item.productId,
    productName: item.productName,
    description: item.description,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  })) || [];

  // Action handlers
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenConfirmDeleteDialog(true);
  };

  const handleImageUpload = (product) => {
    setSelectedProduct(product);
    setOpenImageUploadModal(true);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setOpenProductViewModal(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(removeCatalogItem(setIsDeleting, selectedProduct?.id, toast, setOpenConfirmDeleteDialog));
  };

  const isEmpty = !catalogItems || catalogItems?.length === 0;

  // Get table columns with action handlers
  const columns = getProductTableColumns(
    handleEdit,
    handleDelete,
    handleImageUpload,
    handleProductView
  );

  return (
    <div>
      {/* Add Product Button */}
      <div className='pt-6 pb-10 flex justify-end'>
        <button
          onClick={() => setOpenAddModal(true)}
          className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300'>
          <MdAddShoppingCart className='text-xl' />
          Add Product
        </button>
      </div>

      {/* Table Title */}
      {!isEmpty && (
        <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
          All Products
        </h1>
      )}

      {/* Table or Empty State */}
      {isEmpty ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaBoxOpen size={50} className='mb-3'/>
          <h2 className='text-2xl font-semibold'>No products created yet</h2>
        </div>
      ) : (
        <div className='max-w-full'>
          {/* TanStack Table instead of MUI DataGrid */}
          <DataTable data={tableData} columns={columns} />
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <BaseModal
        open={openUpdateModal || openAddModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
        title={openUpdateModal ? "Update Product" : "Add Product"}>
          <AddProductForm
            setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
            product={selectedProduct}
            update={openUpdateModal}
          />
      </BaseModal>

      {/* Image Upload Modal */}
      <BaseModal
        open={openImageUploadModal}
        setOpen={setOpenImageUploadModal}
        title="Add Product Image">
          <ImageUploadForm
            setOpen={setOpenImageUploadModal}
            product={selectedProduct}
          />
      </BaseModal>

      {/* Delete Confirmation - using new ConfirmDeleteDialog */}
      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        setOpen={setOpenConfirmDeleteDialog}
        loader={isDeleting}
        title="Delete Product"
        onDeleteHandler={handleDeleteConfirm}
      />

      {/* Product View Modal */}
      <ProductQuickView
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedProduct}
        isAvailable={selectedProduct?.quantity > 0}
      />
    </div>
  )
}

export default ProductManagementView;
