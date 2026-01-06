import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, TrendingUp, TrendingDown, Clock, AlertCircle, Plus, Minus, Settings, Users } from 'lucide-react';
import { format } from 'date-fns';

const UserCredits = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [adjustment, setAdjustment] = useState({ type: 'issue', amount: '', reason: '' });

    // Additional state to hold transaction history for selected user (if we were fetching it separately)
    // For now, we will just use placeholders or if the API returned it.
    // The current API /api/admin/users/search returns User objects. 
    // To get credit history we need /api/admin/users/:userId/credits

    const [creditHistory, setCreditHistory] = useState([]);

    // Fetch Users (Initial + Search)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Use port 5001 as currently running
                const response = await axios.get(`http://localhost:5001/api/admin/users/search?q=${searchTerm}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Fetch Credit History when User Selected
    useEffect(() => {
        if (selectedUser) {
            const fetchHistory = async () => {
                try {
                    const response = await axios.get(`http://localhost:5001/api/admin/users/${selectedUser._id}/credits`);
                    // response.data = { user: ..., credits: [...] }
                    setCreditHistory(response.data.credits || []);
                } catch (error) {
                    console.error("Error fetching credits:", error);
                }
            };
            fetchHistory();
        }
    }, [selectedUser]);

    // Handle Adjustment Submit
    const handleAdjustment = async () => {
        if (!selectedUser || !adjustment.amount) return;

        try {
            await axios.post(`http://localhost:5001/api/admin/users/${selectedUser._id}/credits/adjust`, {
                action: adjustment.type,
                amount: adjustment.amount,
                reason: adjustment.reason
            });

            alert('Adjustment successful!');
            setAdjustment({ type: 'issue', amount: '', reason: '' });

            // Re-fetch user to get updated balance
            const response = await axios.get(`http://localhost:5001/api/admin/users/search?q=${selectedUser._id}`);
            if (response.data.length > 0) {
                // Update the user in the list to reflect new balance immediately
                const updatedUser = response.data[0];
                setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
                setSelectedUser(updatedUser);
            }

            // Re-fetch history
            const histResponse = await axios.get(`http://localhost:5001/api/admin/users/${selectedUser._id}/credits`);
            setCreditHistory(histResponse.data.credits || []);

        } catch (error) {
            console.error("Adjustment failed:", error);
            alert('Failed to adjust credits.');
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">

            {/* Left Panel: User List */}
            <div className={`flex-1 bg-white rounded border border-gray-200 flex flex-col overflow-hidden ${selectedUser ? 'hidden lg:flex lg:w-1/3 lg:flex-none' : 'w-full'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-lg mb-4">Manage User Credits</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by User Name or ID..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {users.map(user => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-3 rounded cursor-pointer border border-transparent transition-all duration-200 flex items-center justify-between group
                 ${selectedUser?._id === user._id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50 text-gray-900 border-gray-100'}
               `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedUser?._id === user._id ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{user.name}</p>
                                    <p className={`text-xs ${selectedUser?._id === user._id ? 'text-blue-500' : 'text-gray-500'}`}>{user.email}</p>
                                </div>
                            </div>
                            <span className="font-bold">₹{user.wallet?.totalCredits || 0}</span>
                        </div>
                    ))}
                </div>

                <div className="p-3 border-t border-gray-200 text-center text-xs text-gray-500">
                    Showing {users.length} users
                </div>
            </div>

            {/* Right Panel: User Details (Conditional) */}
            {selectedUser ? (
                <div className="flex-[2] bg-white rounded border border-gray-200 flex flex-col p-8 overflow-y-auto relative">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* User Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                                <span>{selectedUser.email}</span>
                                <span>•</span>
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active Member
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 rounded p-5 border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Balance</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-gray-900">₹{selectedUser.wallet?.totalCredits || 0}</span>
                                <span className="text-green-600 text-xs font-bold mb-1 bg-green-100 px-1.5 py-0.5 rounded">+12%</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded p-5 border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiring (7 Days)</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-gray-900">₹{selectedUser.wallet?.expiringCredits || 0}</span>
                                <span className="text-orange-600 text-xs font-medium mb-1">Soon</span>
                            </div>
                        </div>
                    </div>

                    {/* Manual Adjustment */}
                    <div className="mb-0">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Manual Adjustment
                        </h3>
                        <div className="bg-white border border-gray-300 rounded p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <button
                                    onClick={() => setAdjustment({ ...adjustment, type: 'issue' })}
                                    className={`flex items-center justify-center gap-2 py-3 rounded border font-bold transition-all
                      ${adjustment.type === 'issue' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}
                    `}
                                >
                                    <Plus className="w-4 h-4" /> Issue Credits
                                </button>
                                <button
                                    onClick={() => setAdjustment({ ...adjustment, type: 'revoke' })}
                                    className={`flex items-center justify-center gap-2 py-3 rounded border font-bold transition-all
                      ${adjustment.type === 'revoke' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}
                    `}
                                >
                                    <Minus className="w-4 h-4" /> Revoke Credits
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={adjustment.amount}
                                            onChange={(e) => setAdjustment({ ...adjustment, amount: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded font-bold text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Reason / Note</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Loyalty Bonus for Campaign X"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={handleAdjustment}
                                    className={`w-full py-3 rounded font-bold text-white transition-all
                      ${adjustment.type === 'issue' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                   `}>
                                    Confirm Adjustment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History (Scrollable) */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Transaction History
                            </h3>
                            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                        </div>

                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
                            {creditHistory.length === 0 ? (
                                <p className="text-gray-400 text-sm italic pl-6">No credit history found.</p>
                            ) : (
                                creditHistory.map((tx, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${tx.amount > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{tx.type.replace('_', ' ').toUpperCase()}</p>
                                                <p className="text-xs text-gray-500 text-ellipsis overflow-hidden">{tx.description || tx.orderId || 'Manual Adjustment'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-[10px] text-gray-400">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                /* Empty State */
                <div className="hidden lg:flex flex-[2] bg-gray-50 rounded border border-gray-200 border-dashed items-center justify-center flex-col text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="font-medium">Select a user to manage credits</p>
                </div>
            )}

        </div>
    );
};

export default UserCredits;
