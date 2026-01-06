import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronRight, Calculator, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hardcoded demo user ID from seed data
    const DEMO_USER_ID = '695ce2dd7e052ae2f176f01d';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/api/orders/user/${DEMO_USER_ID}`);
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error("Expected array but got:", response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
                <div className="text-gray-500">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans pb-20">
            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/order" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                        <div className="w-8 h-8 bg-[#EAB308] rounded-lg"></div> LuxeCart
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 font-bold">Admin Panel</Link>
                        <a href="#" className="text-black font-semibold">My Orders</a>
                        <a href="#" className="hover:text-black">Profile</a>
                        <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto pt-8 px-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>

                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
                            No orders found.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <Link
                                key={order._id}
                                to={`/order/${order.orderId}`}
                                className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Order #{order.orderId}</h3>
                                            <p className="text-xs text-gray-500">
                                                Placed on {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                                    <div className="text-gray-600">
                                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                    </div>
                                    <div className="font-bold text-gray-900">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderListPage;
