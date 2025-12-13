/**
 * SidebarNav.jsx
 * Sidebar navigation component for admin and profile pages.
 * Renamed from Sidebar for better clarity.
 */

import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { adminNavigation } from '../../../utilities/navigationConfig';
import classNames from 'classnames';

const SidebarNav = ({isProfileLayout = false}) => {
    const pathName = useLocation().pathname;
    const { currentUser } = useSelector((state) => state.authentication);

    const isAdmin = currentUser && currentUser?.roles?.includes("ROLE_ADMIN");

    const sideBarLayout = adminNavigation;
    
  return (
    <div className='flex grow flex-col gap-y-7 overflow-y-auto bg-custom-gradient px-6 pb-4'>
        <div className='flex h-16 shrink-0 gap-x-3 pt-2'>
            <FaTachometerAlt className='h-8 w-8 text-red-100'/>
            <h1 className='text-white text-xl font-bold'>
                Admin Panel
            </h1>
        </div>
        <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                    <ul role='list' className='-mx-2 space-y-4'>
                        {sideBarLayout.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        pathName === item.href
                                            ? "bg-red-100 text-custom-blue"
                                            : "text-gray-300 hover:bg-red-900 hover:text-white",
                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}>

                                        <item.icon className='text-2xl'/>
                                        {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default SidebarNav