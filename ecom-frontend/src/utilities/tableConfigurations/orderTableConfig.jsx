/**
 * orderTableConfig.jsx
 * Table configuration for admin order management using TanStack Table.
 */

import { FaEdit, FaEye } from "react-icons/fa";

/**
 * Creates order table columns configuration
 * @param {Function} handleEdit - Edit order callback
 * @param {Function} handleViewDetails - View order details callback
 */
export const getOrderTableColumns = (handleEdit, handleViewDetails) => [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Customer Email',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: info => `$${Number(info.getValue()).toFixed(2)}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => (
      <span className={`px-2 py-1 rounded text-sm ${
        info.getValue() === 'Order Accepted !' ? 'bg-green-100 text-green-800' :
        info.getValue() === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Order Date',
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
          onClick={() => handleViewDetails(row.original)}
          className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-md text-sm">
          <FaEye className="mr-1" />
          View
        </button>
      </div>
    ),
  },
];
