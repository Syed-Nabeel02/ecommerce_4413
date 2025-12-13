/**
 * CustomerManagementView.jsx
 * Admin customer management with TanStack Table.
 */

import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useCustomerFilter from './components/customers/useCustomerFilter';
import { getCustomerTableColumns } from '../../utilities/tableConfigurations/customerTableConfig';
import DataTable from '../../components/ui/layout/DataTable';
import CustomerDetailsModal from './components/customers/CustomerDetailsModal';

const CustomerManagementView = () => {
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { customers } = useSelector((state) => state.customer);

  useCustomerFilter();

  // Transform data for TanStack Table
  const tableData = customers?.map((item) => ({
    id: item.userId,
    username: item.username,
    email: item.email,
  })) || [];

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setViewDetailsModal(true);
  };

  const isEmpty = !customers || customers?.length === 0;
  const columns = getCustomerTableColumns(handleViewDetails);

  return (
    <div className='pb-6 pt-20'>
      {isEmpty ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaUsers size={50} className='mb-3'/>
          <h2 className='text-2xl font-semibold'>No Customers Yet</h2>
        </div>
      ) : (
        <div>
          <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
            All Customers
          </h1>

          {/* TanStack Table */}
          <DataTable data={tableData} columns={columns} />

          {/* Customer Details Modal */}
          <CustomerDetailsModal
            open={viewDetailsModal}
            setOpen={setViewDetailsModal}
            customer={selectedCustomer}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerManagementView;
