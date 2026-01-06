import React from 'react';
import { Plus, Filter, Download, Calendar } from 'lucide-react';

const Promotions = () => {
    const campaigns = [
        { id: '#PRO-001', name: 'Spring Kickoff Referral', credits: 500, condition: 'Referral', date: 'Mar 1 - Mar 31', target: 'All Users', status: 'Active' },
        { id: '#PRO-002', name: 'New User Welcome', credits: 1000, condition: 'First Purchase', date: 'Jan 1 - Dec 31', target: 'New Users', status: 'Active' },
        { id: '#PRO-003', name: 'VIP Tier Bonus', credits: 2000, condition: 'Spend > 500', date: 'Apr 15 - Apr 20', target: 'Returning VIPs', status: 'Scheduled' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Credit Campaigns</h1>
                    <p className="text-gray-500">Manage and track your credit-based promotional campaigns.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create New Promotion
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards Mock */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-3xl font-bold text-gray-900">12</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Active Campaigns</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-3xl font-bold text-gray-900">1.2M</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Total Credits Awarded</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <input type="text" placeholder="Search promotions..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 bg-white" />
                    {/* Icon placeholder */}
                </div>
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Promotion Name</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Credits Offered</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Conditions</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date Range</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Target</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {campaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <p className="font-bold text-gray-900 text-sm">{camp.name}</p>
                                    <p className="text-xs text-gray-400">{camp.id}</p>
                                </td>
                                <td className="p-4 font-bold">{camp.credits} Credits</td>
                                <td className="p-4">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{camp.condition}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {camp.date}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {camp.target}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold \${
                           camp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                                        ● {camp.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Promotions;
