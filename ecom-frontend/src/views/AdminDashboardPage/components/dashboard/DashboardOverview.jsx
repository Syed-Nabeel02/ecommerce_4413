import { Icon } from '@mui/material';
import React from 'react'

const DashboardOverview = ({ title, amount, Icon, revenue = false }) => {

  const convertedAmount = revenue ? Number(amount).toFixed(2) : amount;

  // Format revenue for display (e.g., 1500000 -> "1.50M")
  const formatRevenue = (value) => {
    const num = Number(value);
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

    return (
    <>
    <div className='xl:w-80 w-full space-y-4 text-center md:text-start px-5 py-8'>
        <div className='flex md:justify-start justify-center items-center gap-2'>
            <h3 className='uppercase text-2xl text-red-800 font-semibold'>{title}</h3>
            <Icon className='text-red-900 text-2xl' />
        </div>

        <h1 className='font-bold text-red-900 text-3xl'>
            {revenue ? "$" : null}
            {revenue ? formatRevenue(convertedAmount) : convertedAmount}
        </h1>
    </div>
    </>
  )
}

export default DashboardOverview