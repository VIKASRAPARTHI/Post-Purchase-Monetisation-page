import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Rocket, Crown, Users, TrendingUp, Plus } from 'lucide-react';
import { format } from 'date-fns';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalIssued: 0,
        boostRevenue: 0,
        activePremiumWallets: 0,
        avgCreditsPerUser: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/admin/credits/stats'),
                    axios.get('http://localhost:5001/api/admin/transactions')
                ]);
                setStats(statsRes.data);
                setTransactions(txRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Manage your credit economy and rules.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Issue Manual Credit
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Issued', value: `₹${stats.totalIssued.toLocaleString()}`, trend: '+12%', icon: DollarSign, color: 'text-gray-600', bg: 'bg-gray-100' },
                    { label: 'Boost Revenue', value: `₹${stats.boostRevenue.toLocaleString()}`, trend: '+8.5%', icon: Rocket, color: 'text-gray-600', bg: 'bg-gray-100' },
                    { label: 'Active Premium', value: stats.activePremiumWallets.toLocaleString(), trend: '+5%', icon: Crown, color: 'text-gray-600', bg: 'bg-gray-100' },
                    { label: 'Proft/Loss', value: '₹0', trend: '+0%', icon: Users, color: 'text-gray-600', bg: 'bg-gray-100' }, // Placeholder for now
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                            <TrendingUp className="w-3 h-3" /> {stat.trend} <span className="text-gray-400 font-normal">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Quick Settings */}
                <div className="lg:col-span-2 bg-white rounded border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Monetization Settings</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: 'Credit Booster', price: '₹49', status: true, icon: Rocket },
                            { name: 'Early Unlock', price: '₹29', status: true, icon: Users },
                            { name: 'Premium Wallet', price: '₹99', status: true, icon: Crown },
                        ].map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
                                <div className={`p-3 rounded-full mb-3 ${item.status ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                <p className="text-gray-500 text-xs mt-1 mb-3">Price: {item.price}</p>
                                <div className="w-full mt-auto">
                                    <span className="flex h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <span className="bg-green-500 w-full"></span>
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-2">Active</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent transactions.</p>
                        ) : (
                            transactions.map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                            {tx.userId?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{tx.userId?.name || 'Unknown User'}</p>
                                            <p className="text-xs text-gray-500">{tx.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${['credit_booster', 'premium_subscription'].includes(tx.type) ? 'text-green-600' : 'text-gray-900'}`}>
                                            ₹{tx.amount}
                                        </p>
                                        <p className="text-[10px] text-gray-400">{format(new Date(tx.createdAt), 'MMM d, HH:mm')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-4 text-sm text-gray-500 hover:text-gray-800 font-medium py-2 border border-dashed border-gray-200 rounded hover:border-gray-300 transition-colors">
                        View All Transactions
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DashboardOverview;
