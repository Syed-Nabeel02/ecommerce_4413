/**
 * OrderManagementView.jsx
 * Admin order management with TanStack Table.
 * View and update order statuses.
 */

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../hooks/useOrderFilter';
import { getOrderTableColumns } from '../../utilities/tableConfigurations/orderTableConfig';
import DataTable from '../../components/ui/layout/DataTable';
import BaseModal from '../../components/ui/modals/BaseModal';
import UpdateOrderForm from './components/orders/UpdateOrderForm';
import OrderDetailsModal from './components/orders/OrderDetailsModal';

const OrderManagementView = () => {
  const {adminOrder, pagination} = useSelector((state) => state.order);
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loader, setLoader] = useState(false);

  // Custom hook for filtering
  useOrderFilter();

  // Transform data for TanStack Table
  const tableData = adminOrder?.map((item) => ({
    id: item.orderId,
    email: item.email,
    totalAmount: item.totalAmount,
    status: item.orderStatus,
    date: item.orderDate,
    orderItems: item.orderItems,
    payment: item.payment,
    addressId: item.addressId,
  })) || [];

  const handleEdit = (order) => {
    setSelectedItem(order);
    setUpdateOpenModal(true);
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setViewDetailsModal(true);
  }

  const isEmpty = !adminOrder || adminOrder?.length === 0;

  // Get table columns with action handlers
  const columns = getOrderTableColumns(handleEdit, handleViewDetails);

  return (
    <div className='pb-6 pt-20'>
      {isEmpty ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaShoppingCart size={50} className='mb-3'/>
          <h2 className='text-2xl font-semibold'>No Sales History Yet</h2>
        </div>
      ) : (
        <div>
          <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
            Sales History
          </h1>

          {/* TanStack Table instead of MUI DataGrid */}
          <DataTable data={tableData} columns={columns} />

          {/* Update Order Modal */}
          <BaseModal
            open={updateOpenModal}
            setOpen={setUpdateOpenModal}
            title='Update Sale Status'>
              <UpdateOrderForm
                setOpen={setUpdateOpenModal}
                open={updateOpenModal}
                loader={loader}
                setLoader={setLoader}
                selectedId={selectedItem.id}
                selectedItem={selectedItem}
              />
          </BaseModal>

          {/* Order Details Modal */}
          <OrderDetailsModal
            open={viewDetailsModal}
            setOpen={setViewDetailsModal}
            order={selectedOrder}
          />
        </div>
      )}
    </div>
  )
}

export default OrderManagementView;
