import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Filter, Download, Calendar, Save, X } from 'lucide-react';
import { format } from 'date-fns';

const Promotions = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newPromo, setNewPromo] = useState({
        name: '',
        credits: '',
        condition: 'First Purchase',
        startDate: '',
        endDate: '',
        targetAudience: 'All Users',
        status: 'Draft'
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/promotions');
            setCampaigns(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching promotions:", error);
            setLoading(false);
        }
    };

    const handleCreatePromo = async () => {
        try {
            await axios.post('http://localhost:5001/api/admin/promotions', newPromo);
            setShowModal(false);
            setNewPromo({ name: '', credits: '', condition: 'First Purchase', startDate: '', endDate: '', targetAudience: 'All Users', status: 'Draft' });
            fetchPromotions();
        } catch (error) {
            console.error("Error creating promotion:", error);
            alert("Failed to create promotion");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Credit Campaigns</h1>
                    <p className="text-gray-500">Manage and track your credit-based promotional campaigns.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create New Promotion
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-3xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'Active').length}</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Active Campaigns</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-3xl font-bold text-gray-900">
                        {(campaigns.reduce((acc, curr) => acc + (curr.usageCount * curr.credits), 0) / 1000).toFixed(1)}k
                    </h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Total Credits Awarded</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <input type="text" placeholder="Search promotions..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 bg-white" />
                </div>
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                    <Filter className="w-4 h-4" /> Filter
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
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center">Loading campaigns...</td></tr>
                        ) : campaigns.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center">No campaigns found.</td></tr>
                        ) : (
                            campaigns.map((camp) => (
                                <tr key={camp._id} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 text-sm">{camp.name}</p>
                                        <p className="text-xs text-gray-400">ID: {camp._id.substr(-6).toUpperCase()}</p>
                                    </td>
                                    <td className="p-4 font-bold">{camp.credits} Credits</td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{camp.condition}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {format(new Date(camp.startDate), 'MMM d')} - {format(new Date(camp.endDate), 'MMM d, yyyy')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {camp.targetAudience}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${camp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            ● {camp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">New Promotion</h2>
                            <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                    value={newPromo.name}
                                    onChange={e => setNewPromo({ ...newPromo, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Target Audience</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        value={newPromo.targetAudience}
                                        onChange={e => setNewPromo({ ...newPromo, targetAudience: e.target.value })}
                                    >
                                        <option>All Users</option>
                                        <option>New Users</option>
                                        <option>Returning VIPs</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Credits</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        value={newPromo.credits}
                                        onChange={e => setNewPromo({ ...newPromo, credits: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        value={newPromo.startDate}
                                        onChange={e => setNewPromo({ ...newPromo, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        value={newPromo.endDate}
                                        onChange={e => setNewPromo({ ...newPromo, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                    value={newPromo.status}
                                    onChange={e => setNewPromo({ ...newPromo, status: e.target.value })}
                                >
                                    <option>Draft</option>
                                    <option>Active</option>
                                    <option>Scheduled</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button onClick={handleCreatePromo} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;
