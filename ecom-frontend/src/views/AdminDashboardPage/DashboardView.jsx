/**
 * DashboardView.jsx
 * Admin dashboard overview showing key metrics: products, orders, revenue.
 * Uses DashboardOverview component to display metric cards.
 */

import React, { useEffect } from 'react'
import DashboardOverview from './components/dashboard/DashboardOverview'
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsAction } from '../../store/actions';
import ErrorDisplay from '../../components/ui/feedback/ErrorDisplay';

const DashboardView = () => {
  const dispatch = useDispatch();
  const { errorMessage} = useSelector((state) => state.errors);
  const {
    analytics: { productCount, totalRevenue, totalOrders },
   } = useSelector((state) => state.admin);

   // Fetch analytics data on mount
   useEffect(() => {
    dispatch(analyticsAction());
   }, [dispatch]);

   if (errorMessage) {
    return <ErrorDisplay message={errorMessage}/>;
   }

  return (
    <div>
      {/* Metrics overview cards with gradient background */}
      <div className='flex md:flex-row mt-8 flex-col lg:justify-between
          border border-red-300 rounded-lg bg-gradient-to-r
           from-red-50 to-red-100 shadow-lg'>

            <DashboardOverview
              title="Total Products"
              amount={productCount}
              Icon={FaBoxOpen}
            />

            <DashboardOverview
              title="Total Orders"
              amount={totalOrders}
              Icon={FaShoppingCart}
            />

            <DashboardOverview
              title="Total Revenue"
              amount={totalRevenue}
              Icon={FaDollarSign}
              revenue
            />
      </div>
    </div>
  )
}

export default DashboardView;
