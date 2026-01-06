import React from 'react';
import { Bell } from 'lucide-react';

const ExclusiveDropCard = () => {
    return (
        <div className="bg-[#2D2D35] rounded-xl p-6 text-white mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#4B5563] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    Exclusive Drop
                </span>
            </div>

            <h3 className="font-bold text-lg leading-tight mb-6">
                Exclusive bundle unlocks tomorrow at 10 AM
            </h3>

            <button className="w-full bg-[#3F3F48] hover:bg-[#4B4B55] border border-[#52525B] text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" /> Set Reminder
            </button>
        </div>
    );
};

export default ExclusiveDropCard;
