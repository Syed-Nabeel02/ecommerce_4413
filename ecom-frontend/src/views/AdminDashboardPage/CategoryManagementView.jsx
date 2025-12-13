/**
 * CategoryManagementView.jsx
 * Admin category management with TanStack Table.
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFolderOpen, FaThList } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseModal from "../../components/ui/modals/BaseModal";
import AddCategoryForm from "./components/categories/AddCategoryForm";
import ConfirmDeleteDialog from "../../components/ui/modals/ConfirmDeleteDialog";
import useCategoryFilter from "../../hooks/useCategoryFilter";
import ErrorDisplay from "../../components/ui/feedback/ErrorDisplay";
import { removeDashboardCategory } from "../../store/actions";
import { getCategoryTableColumns } from "../../utilities/tableConfigurations/categoryTableConfig";
import DataTable from "../../components/ui/layout/DataTable";

const CategoryManagementView = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
  const { categoryList } = useSelector((state) => state.catalog);

  useCategoryFilter();

  // Transform data for TanStack Table
  const tableData = categoryList?.map((item) => ({
    id: item.categoryId,
    categoryName: item.categoryName,
    version: item.version,
  })) || [];

  const handleEdit = (category) => {
    setOpenUpdateModal(true);
    setSelectedCategory(category);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setOpenConfirmDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(removeDashboardCategory(setOpenConfirmDeleteDialog, selectedCategory?.id, toast));
  };

  const isEmpty = !categoryList || categoryList?.length === 0;
  const columns = getCategoryTableColumns(handleEdit, handleDelete);

  return (
    <div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-20">
          <FaFolderOpen size={50} className="mb-3" />
          <h2 className="text-2xl font-semibold mb-6">No Categories Created Yet</h2>
          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>
          )}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-3 px-6 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300">
            <FaThList className="text-xl" />
            Add Category
          </button>
        </div>
      ) : (
        <>
          <div className="pt-6 pb-10 flex justify-end">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300">
              <FaThList className="text-xl" />
              Add Category
            </button>
          </div>
          <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
            All Categories
          </h1>

          {/* TanStack Table */}
          <div className="max-w-fit mx-auto">
            <DataTable data={tableData} columns={columns} />
          </div>
        </>
      )}

      {/* Add/Edit Category Modal */}
      <BaseModal
        open={openUpdateModal || openModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
        title={openUpdateModal ? "Update Category" : "Add Category"}>
        <AddCategoryForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
          open={categoryLoader}
          category={selectedCategory}
          update={openUpdateModal}
        />
      </BaseModal>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        loader={categoryLoader}
        setOpen={setOpenConfirmDeleteDialog}
        title="Delete Category"
        onDeleteHandler={handleDeleteConfirm}
      />
    </div>
  );
};

export default CategoryManagementView;
