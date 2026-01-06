import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const CreditRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newRule, setNewRule] = useState({
        name: '',
        conditionType: 'order_value',
        conditionValue: '',
        rewardAmount: '',
        unlockPeriod: 0,
        isActive: true
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await axios.get('/api/admin/rules');
            setRules(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rules:", error);
            setLoading(false);
        }
    };

    const handleCreateRule = async () => {
        try {
            await axios.post('/api/admin/rules', newRule);
            setShowModal(false);
            setNewRule({ name: '', conditionType: 'order_value', conditionValue: '', rewardAmount: '', unlockPeriod: 0, isActive: true });
            fetchRules();
        } catch (error) {
            console.error("Error creating rule:", error);
            alert("Failed to create rule");
        }
    };

    const handleToggleRule = async (id) => {
        try {
            await axios.patch(`/api/admin/rules/${id}/toggle`);
            setRules(rules.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r));
        } catch (error) {
            console.error("Error toggling rule:", error);
        }
    };

    const handleDeleteRule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this rule?")) return;
        try {
            await axios.delete(`/api/admin/rules/${id}`);
            setRules(rules.filter(r => r._id !== id));
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Credit Earning Rules</h1>
                    <p className="text-gray-500">Manage logic for distributing Future Credits based on user actions.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Rule
                </button>
            </div>

            {/* Summary Stats (Mock for now or derive from rules) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Rules</p>
                    <h3 className="text-3xl font-bold text-gray-900">{rules.filter(r => r.isActive).length}</h3>
                </div>
                {/* These could be calculated from backend stats later */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-60">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Credits Distributed (Month)</p>
                    <h3 className="text-3xl font-bold text-gray-900">₹--</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-60">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Claim Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900">--%</h3>
                </div>
            </div>

            {/* Rules Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rule Name</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reward</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unlock Period</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center">Loading rules...</td></tr>
                        ) : rules.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No rules found. Add one!</td></tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{rule.name}</td>
                                    <td className="p-4 text-gray-600">
                                        {rule.conditionType === 'order_value' ? `Order > ₹${rule.conditionValue}` : 'Specific Product'}
                                    </td>
                                    <td className="p-4 font-bold text-green-600">₹{rule.rewardAmount}</td>
                                    <td className="p-4 text-gray-600">{rule.unlockPeriod} Days</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {rule.isActive ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {rule.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleRule(rule._id)}
                                                className={`p-2 rounded-lg transition-colors ${rule.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                            >
                                                {rule.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRule(rule._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add New Rule</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                    placeholder="e.g. Weekend Mega Sale"
                                    value={newRule.name}
                                    onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Trigger Condition</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        value={newRule.conditionType}
                                        onChange={e => setNewRule({ ...newRule, conditionType: e.target.value })}
                                    >
                                        <option value="order_value">Order Value</option>
                                        <option value="product_purchase">Specific Product</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Value (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        placeholder="2500"
                                        value={newRule.conditionValue}
                                        onChange={e => setNewRule({ ...newRule, conditionValue: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Credits Awarded</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        placeholder="100"
                                        value={newRule.rewardAmount}
                                        onChange={e => setNewRule({ ...newRule, rewardAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Unlock Period (Days)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50"
                                        placeholder="7"
                                        value={newRule.unlockPeriod}
                                        onChange={e => setNewRule({ ...newRule, unlockPeriod: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium">Initial Status</span>
                                <div onClick={() => setNewRule({ ...newRule, isActive: !newRule.isActive })} className="cursor-pointer">
                                    {newRule.isActive ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleCreateRule} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg shadow-green-200 hover:bg-green-700 transition-colors">Save Rule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditRules;
