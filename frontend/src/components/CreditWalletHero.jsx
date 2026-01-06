import React from 'react';
import { Lock, Clock } from 'lucide-react';
import { format } from 'date-fns';

const CreditWalletHero = ({ credits, loading }) => {
    return (
        <div className="bg-[#FFF9EC] border border-[#FFE7B9] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="bg-[#FFF0D4] text-[#B27B16] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Future Reward
                </span>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    You've unlocked <span className="text-[#D97706] text-2xl font-extrabold">₹120</span>
                </h2>
                <p className="text-gray-600 text-sm mt-1">in Brand Credits for your <span className="font-bold text-gray-900">₹2500 order</span></p>
            </div>

            {/* Timeline Progress */}
            <div className="bg-white rounded-lg p-4 border border-[#FFE7B9] flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UNLOCK IN</p>
                        <p className="text-sm font-bold text-gray-900">7 Days</p>
                    </div>
                </div>
                <div className="h-full w-px bg-gray-100 mx-2"></div>
                <div className="text-[#D97706] text-xs font-bold text-right">
                    Why wait?
                </div>
            </div>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group">
                Learn how to unlock faster
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
        </div>
    );
};

export default CreditWalletHero;
