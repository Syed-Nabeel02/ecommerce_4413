/**
 * productTableConfig.jsx
 * Table configuration for admin product management using TanStack Table.
 * Replaces MUI DataGrid column definitions with TanStack Table format.
 */

import { FaEdit, FaEye, FaImage, FaTrashAlt } from "react-icons/fa";

/**
 * Creates product table columns configuration
 * @param {Function} handleEdit - Edit product callback
 * @param {Function} handleDelete - Delete product callback
 * @param {Function} handleImageUpload - Image upload callback
 * @param {Function} handleProductView - View product details callback
 */
export const getProductTableColumns = (
  handleEdit,
  handleDelete,
  handleImageUpload,
  handleProductView
) => [
  {
    accessorKey: 'id',
    header: 'Product ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'productName',
    header: 'Product Name',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: info => `$${Number(info.getValue()).toFixed(2)}`,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: info => {
      const desc = info.getValue();
      return desc?.length > 50 ? desc.substring(0, 50) + '...' : desc;
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: info => info.getValue() ? 'Yes' : 'No',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => handleImageUpload(row.original)}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm">
          <FaImage className="mr-1" />
          Image
        </button>
        <button
          onClick={() => handleEdit(row.original)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
          <FaEdit className="mr-1" />
          Edit
        </button>
        <button
          onClick={() => handleDelete(row.original)}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm">
          <FaTrashAlt className="mr-1" />
          Delete
        </button>
        <button
          onClick={() => handleProductView(row.original)}
          className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-md text-sm">
          <FaEye className="mr-1" />
          View
        </button>
      </div>
    ),
  },
];
