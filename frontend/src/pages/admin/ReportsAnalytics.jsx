import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Calendar, BarChart, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';

const ReportsAnalytics = () => {
    const [stats, setStats] = useState({
        totalIssued: 0,
        redemptionRate: 0,
        netRevenue: 0,
        breakageRate: 0
    });
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, trendsRes] = await Promise.all([
                    axios.get('/api/admin/credits/stats'),
                    axios.get('/api/admin/credits/trends')
                ]);
                setStats(statsRes.data);
                setTrends(trendsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amt) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500">Insights into credit usage, monetization, and user engagement.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-gray-50">
                        <Calendar className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Issued', value: formatNumber(stats.totalIssued), trend: 'Credits Distributed', color: 'text-green-600', icon: Activity },
                    { label: 'Redemption Rate', value: `${stats.redemptionRate}%`, trend: 'Usage Efficiency', color: 'text-blue-600', icon: TrendingUp },
                    { label: 'Net Revenue', value: formatCurrency(stats.netRevenue), trend: 'Total Earnings', color: 'text-green-600', icon: DollarSign },
                    { label: 'Breakage Rate', value: `${stats.breakageRate}%`, trend: 'Expired credits', color: 'text-gray-500', icon: BarChart },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <stat.icon className={`w-5 h-5 opacity-20 ${stat.color.replace('text-', 'bg-')}`} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className={`text-xs font-bold ${stat.color}`}>{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col">
                    <h3 className="text-gray-900 font-bold mb-4">Daily Issuance Trend (Last 30 Days)</h3>
                    {/* Simple Bar Visualization */}
                    <div className="flex-1 flex items-end gap-2 overflow-x-auto pb-2">
                        {trends.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No trend data available</div>
                        ) : (
                            trends.map((item) => (
                                <div key={item._id} className="flex flex-col items-center gap-1 group min-w-[30px] flex-1">
                                    <div
                                        className="w-full bg-blue-100 rounded-t hover:bg-blue-200 transition-all relative"
                                        style={{ height: `${Math.min((item.total / Math.max(...trends.map(t => t.total))) * 100, 100)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            ₹{item.total}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{item._id.substr(8)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center">
                    <h3 className="text-gray-900 font-bold mb-auto w-full">Revenue Sources</h3>
                    {/* Placeholder for Pie Chart */}
                    <div className="w-full h-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 flex-col gap-2">
                        <DollarSign className="w-12 h-12 opacity-50" />
                        <div className="text-center">
                            <span className="font-medium block">Breakdown</span>
                            <span className="text-xs">Physical Orders: {((stats.netRevenue - stats.boostRevenue) / stats.netRevenue * 100 || 0).toFixed(0)}%</span>
                            <span className="text-xs ml-2">Digital/Services: {((stats.boostRevenue) / stats.netRevenue * 100 || 0).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Recent Exports</h3>
                    <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Q3_Monetization_Report.csv', date: 'Oct 12, 2023', size: '2.4 MB' },
                        { name: 'User_Breakage_Analysis.pdf', date: 'Oct 10, 2023', size: '1.1 MB' },
                    ].map((file, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.date}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">{file.size}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
