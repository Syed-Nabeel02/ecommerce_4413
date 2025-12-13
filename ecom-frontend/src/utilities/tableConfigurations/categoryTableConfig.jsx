/**
 * categoryTableConfig.jsx
 * Table configuration for admin category management using TanStack Table.
 */

import { FaEdit, FaTrashAlt } from "react-icons/fa";

/**
 * Creates category table columns configuration
 * @param {Function} handleEdit - Edit category callback
 * @param {Function} handleDelete - Delete category callback
 */
export const getCategoryTableColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: 'id',
    header: 'Category ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'categoryName',
    header: 'Category Name',
    cell: info => info.getValue(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center items-center space-x-2">
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
      </div>
    ),
  },
];
