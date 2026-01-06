import React, { useState } from 'react';
import { Zap, Unlock, Crown, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const MonetizationCards = ({ userId, onUpdate, settings, lockedCredits }) => {
    const [loading, setLoading] = useState(null); // 'boost', 'unlock', 'premium'

    const handleAction = async (action) => {
        setLoading(action);
        // Simulate API call
        setTimeout(() => {
            setLoading(null);
            if (onUpdate) onUpdate();
        }, 1500);
    };

    if (!settings) return null; // Or skeleton

    const booster = settings.creditBooster || { price: 49, multiplier: 2 };
    const unlock = settings.earlyUnlock || { price: 29 };
    const premium = settings.premiumWallet || { price: 99 };

    // Calculate potential boost value
    const potentialBoostValue = (lockedCredits || 0) * (booster.multiplier || 2);

    return (
        <div>
            {/* 1. GROW YOUR CREDITS SECTION */}
            <div className="mb-6">
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-4">Grow your credits</h3>

                <div className="space-y-3">
                    {/* Credit Booster Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                <Zap className="w-4 h-4" fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Credit Booster</h4>
                                <p className="text-xs text-gray-500">Multiply credits by <strong>{booster.multiplier}x</strong> to <span className="text-orange-500 font-bold">₹{potentialBoostValue}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAction('boost')}
                            className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            ₹{booster.price}
                        </button>
                    </div>

                    {/* Early Unlock Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Unlock className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Early Unlock</h4>
                                <p className="text-xs text-gray-500">Use credits now, no wait</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAction('unlock')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            ₹{unlock.price}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. PREMIUM WALLET CARD */}
            <div className="bg-[#0F172A] rounded-xl p-5 text-white relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <h3 className="font-bold text-sm text-yellow-400">Premium Wallet</h3>
                    </div>
                    <span className="bg-[#1E293B] text-[#94A3B8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Recommended</span>
                </div>

                <ul className="space-y-2 mb-6 relative z-10">
                    <li className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full"></span> Credits never expire
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full"></span> Extra monthly boost
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full"></span> Exclusive deals
                    </li>
                </ul>

                <button
                    onClick={() => handleAction('premium')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-orange-500/20 transition-all relative z-10"
                >
                    Upgrade for ₹{premium.price}/mo
                </button>
            </div>
        </div>
    );
};

export default MonetizationCards;
