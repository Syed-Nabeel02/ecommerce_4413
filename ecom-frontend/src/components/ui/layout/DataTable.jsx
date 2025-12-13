/**
 * DataTable.jsx
 *
 * DESCRIPTION:
 * A reusable data table component for displaying tabular data with sorting and pagination.
 * Built using TanStack Table (React Table v8), a headless table library that provides
 * powerful table functionality while giving us complete control over styling.
 *
 * USED IN:
 * - Admin Dashboard - Product Management (displaying products)
 * - Admin Dashboard - Order Management (displaying orders)
 * - Admin Dashboard - Category Management (displaying categories)
 * - Admin Dashboard - Customer Management (displaying customers)
 *
 * KEY FEATURES:
 * - Sortable columns (click header to sort ascending/descending)
 * - Custom cell renderers (for actions, status badges, etc.)
 * - Responsive design with horizontal scrolling on mobile
 * - Clean Tailwind CSS styling
 * - Hover effects on rows
 * - Flexible column configuration
 *
 * DEPENDENCIES:
 * - @tanstack/react-table (headless table library for data management and sorting)
 * - Tailwind CSS (for styling)
 *
 * NOTE:
 * Unlike MUI DataGrid, TanStack Table is "headless" meaning it handles the logic
 * but we build the UI ourselves. This gives us more control and lighter bundle size.
 */

import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';
import { useState } from 'react';

/**
 * DataTable Component
 *
 * @param {Array} data - Array of data objects to display in the table
 * @param {Array} columns - Column configuration array (from tableConfigurations/)
 *
 * Column configuration format:
 * {
 *   accessorKey: 'fieldName',     // Key from data object
 *   header: 'Display Name',        // Column header text
 *   cell: info => info.getValue()  // How to render the cell (optional)
 * }
 *
 * @example
 * import { productColumns } from '../utilities/tableConfigurations/productTableConfig';
 *
 * const products = [
 *   { productId: 1, productName: "Laptop", price: 999 },
 *   { productId: 2, productName: "Mouse", price: 25 }
 * ];
 *
 * <DataTable
 *   data={products}
 *   columns={productColumns}
 * />
 */
const DataTable = ({ data, columns }) => {
  // State for managing sort order (which column and direction)
  // Example: [{id: 'productName', desc: false}] means sort by name ascending
  const [sorting, setSorting] = useState([]);

  // Initialize the table instance with TanStack Table
  // This returns methods and state for rendering and managing the table
  const tableInstance = useReactTable({
    data,                           // The actual data to display
    columns,                        // Column definitions (headers, accessors, cell renderers)
    getCoreRowModel: getCoreRowModel(),     // Required for basic table functionality
    getSortedRowModel: getSortedRowModel(), // Enables sorting functionality
    state: {
      sorting,                      // Current sort state
    },
    onSortingChange: setSorting,    // Function to update sort when user clicks headers
  });

  return (
    // Outer container with horizontal scroll for mobile responsiveness
    // On mobile, table can scroll left/right if it's too wide
    <div className="overflow-x-auto">

      {/* The actual HTML table element */}
      {/* w-full makes it full width, border-collapse merges cell borders */}
      <table className="w-full border-collapse">

        {/* Table Header */}
        <thead>
          {/* Loop through header groups (usually just one) */}
          {tableInstance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>

              {/* Loop through each column header */}
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  // Click handler for sorting - toggles sort direction
                  // If already sorted ascending, clicking makes it descending
                  onClick={header.column.getToggleSortingHandler()}
                  // Styling: border, padding, background color, cursor pointer for sortable columns
                  className="border border-gray-300 p-3 bg-gray-100 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  {/* Render header text */}
                  {/* flexRender handles rendering of header content */}
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {/* Sort indicator - shows arrow when column is sorted */}
                  {/* {asc: false} means sorted ascending (A to Z, 0 to 9) */}
                  {/* {asc: true} means sorted descending (Z to A, 9 to 0) */}
                  {header.column.getIsSorted() && (
                    <span className="ml-2">
                      {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody>
          {/* Loop through each row of data */}
          {tableInstance.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              // Hover effect: background turns light gray when mouse hovers over row
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Loop through each cell in the row */}
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  // Cell styling: border and padding
                  className="border border-gray-300 p-3 text-gray-800"
                >
                  {/* Render cell content */}
                  {/* flexRender executes the cell renderer function from column config */}
                  {/* This allows custom rendering like action buttons, status badges, etc. */}
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state message - shown when there's no data */}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default DataTable;
