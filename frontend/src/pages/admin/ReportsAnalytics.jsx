import React from 'react';
import { Download, Calendar, BarChart } from 'lucide-react';

const ReportsAnalytics = () => {
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
                    { label: 'Total Issued', value: '1.2M', trend: '↗ 12%', color: 'text-green-600' },
                    { label: 'Redemption Rate', value: '68%', trend: '↗ 4%', color: 'text-blue-600' },
                    { label: 'Net Revenue', value: '$45.2k', trend: '↘ 1.2%', color: 'text-red-500' },
                    { label: 'Breakage Rate', value: '12%', sub: 'Expired credits', color: 'text-gray-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className={`text-xs font-bold \${stat.color}`}>{stat.trend || stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center">
                    <h3 className="text-gray-900 font-bold mb-auto w-full">Credit Trends</h3>
                    {/* Chart Placeholder */}
                    <div className="w-full h-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        <BarChart className="w-12 h-12 opacity-50" />
                        <span className="ml-2 font-medium">Chart Visualization Placeholder</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center">
                    <h3 className="text-gray-900 font-bold mb-auto w-full">Revenue Sources</h3>
                    {/* Chart Placeholder */}
                    <div className="w-full h-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        <BarChart className="w-12 h-12 opacity-50" />
                        <span className="ml-2 font-medium">Chart Visualization Placeholder</span>
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
