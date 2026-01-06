import React from 'react';
import { ShoppingBag, Star, Settings2 } from 'lucide-react';

const HelpfulExtras = () => {
    return (
        <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6 px-4">Make the most of your credits</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 font-sm mb-1">Use on next purchase</h4>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        Apply your ₹120 balance automatically at checkout on your next order.
                    </p>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-block">Browse Products →</span>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                        <Star className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 font-sm mb-1">Write a review</h4>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        Earn ₹50 extra credits by reviewing your purchased items after delivery.
                    </p>
                    <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded">Available after delivery</span>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <Settings2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 font-sm mb-1">Complete preferences</h4>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        Tell us what you like to earn ₹20 bonus credits instantly.
                    </p>
                    <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform inline-block">Start survey</span>
                </div>
            </div>
        </div>
    );
};

export default HelpfulExtras;
