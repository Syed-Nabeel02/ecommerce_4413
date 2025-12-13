import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FaBoxOpen, FaShoppingCart, FaUsers, FaThList } from 'react-icons/fa';
import DashboardView from './DashboardView';

const AdminLayoutWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isRootAdmin = location.pathname === '/admin' || location.pathname === '/admin/';

    const adminSections = [
        {
            title: 'Products',
            description: 'Manage your inventory',
            icon: FaBoxOpen,
            path: '/admin/products',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Sales History',
            description: 'Track sales history',
            icon: FaShoppingCart,
            path: '/admin/orders',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Categories',
            description: 'Organize products',
            icon: FaThList,
            path: '/admin/categories',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Customers',
            description: 'View customer data',
            icon: FaUsers,
            path: '/admin/customers',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="bg-custom-gradient text-white py-8 px-6 shadow-xl">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
                    <p className="text-gray-200">York University Store Management</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {isRootAdmin ? (
                    <div className="space-y-10">
                        <DashboardView />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            {adminSections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.path}
                                        onClick={() => navigate(section.path)}
                                        className={`bg-gradient-to-br ${section.color} text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left group`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <Icon className="text-6xl opacity-90 group-hover:scale-110 transition-transform duration-300" />
                                            <div className="bg-white/20 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-3">{section.title}</h3>
                                        <p className="text-white/90 text-base">{section.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="mb-6 flex items-center gap-2 text-purple-600 hover:text-red-500 font-semibold transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Admin Panel
                        </button>
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <Outlet />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminLayoutWrapper;
