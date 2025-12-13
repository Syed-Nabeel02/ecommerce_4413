/**
 * customerTableConfig.jsx
 * Table configuration for admin customer management using TanStack Table.
 */

import { FaEye } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

/**
 * Creates customer table columns configuration
 * @param {Function} handleViewDetails - View customer details callback
 */
export const getCustomerTableColumns = (handleViewDetails) => [
  {
    accessorKey: 'id',
    header: 'Customer ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => (
      <div className="flex items-center gap-1">
        <MdOutlineEmail className="text-slate-700 text-lg" />
        <span>{info.getValue()}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <button
          onClick={() => handleViewDetails(row.original)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
          <FaEye className="mr-1" />
          View Details
        </button>
      </div>
    ),
  },
];
