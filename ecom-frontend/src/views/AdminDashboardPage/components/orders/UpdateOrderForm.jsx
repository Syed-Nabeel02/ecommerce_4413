/**
 * UpdateOrderForm.jsx
 *
 * Form component for updating order status in the admin dashboard.
 * Allows admins to change order status through different stages of fulfillment.
 *
 * USED IN:
 * - OrderManagementView (Admin dashboard)
 *
 * KEY FEATURES:
 * - Dropdown selection for order status
 * - Predefined status options (Pending, Processing, Shipped, etc.)
 * - Form validation
 * - Automatic initialization with current order status
 *
 * DEPENDENCIES:
 * - @mui/material (Select, FormControl for dropdown)
 * - react-hot-toast (success/error notifications)
 *
 * @param {Function} setOpen - Callback to close the modal
 * @param {string} selectedId - ID of the order being updated
 * @param {Object} selectedItem - Order object containing current status
 * @param {boolean} loader - Loading state
 * @param {Function} setLoader - Function to set loading state
 */

import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatusFromDashboard } from '../../../../store/actions';
import toast from 'react-hot-toast';

// Available order statuses in the system
// These represent the lifecycle of an order from placement to completion
const ORDER_STATUSES = [
    "Pending",      // Order placed, awaiting confirmation
    "Processing",   // Order confirmed, being prepared
    "Shipped",      // Order dispatched to customer
    "Delivered",    // Order received by customer
    "Cancelled",    // Order cancelled by customer or admin
    "Accepted",     // Order accepted and ready for processing
];

const UpdateOrderForm = ({ setOpen, selectedId, selectedItem, loader, setLoader}) => {
    const [orderStatus, setOrderStatus] = useState(selectedItem?.status || 'Accepted');
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    /**
     * Handle form submission to update order status
     * Validates that a status is selected before dispatching the update action
     */
    const updateOrderStatus = (e) => {
        e.preventDefault();

        // Validation: Ensure a status is selected
        if (!orderStatus) {
            setError("Sale status is required");
            return;
        }

        // Dispatch action to update order status in the backend
        dispatch(updateOrderStatusFromDashboard(
            selectedId,
            orderStatus,
            toast,
            setLoader
        ));
    };

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4' onSubmit={updateOrderStatus}>
            <FormControl fullWidth variant='outlined' error={!!error}>
                <InputLabel id="order-status-label">Sale Status</InputLabel>
                <Select
                    labelId='order-status-label'
                    label='Sale Status'
                    value={orderStatus}
                    onChange={(e) => {
                        setOrderStatus(e.target.value);
                        setError("");
                    }}>
                    
                    {
                        ORDER_STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))
                    }

                </Select>

                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            <div className='flex w-full justify-between items-center absolute bottom-14'>
                <Button disabled={loader}
                        onClick={() => setOpen(false)}
                        variant='outlined'
                        className='text-white py-[10px] px-4 text-sm font-medium'>
                    Cancel
                </Button>

                <Button
                    disabled={loader}
                    type='submit'
                    variant='contained'
                    color='primary'
                    className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                    {loader ? "Loading..." : "Update"}
                </Button>
            </div>
        </form>

    </div>
  )
}

export default UpdateOrderForm