import React from 'react';
import { Package, MapPin, CreditCard, Clock } from 'lucide-react';

const OrderSummary = ({ order }) => {
    if (!order) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Order Tracking Map Visual */}
            <div className="bg-white p-6 rounded border border-gray-200 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4">Order Tracking</h3>

                {/* Mock Map View - Simplified */}
                <div className="flex-1 bg-gray-200 rounded relative overflow-hidden min-h-[200px] mb-6 flex items-center justify-center text-gray-400 text-sm">
                    Map Placeholder
                    <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded text-xs font-bold shadow-sm border border-gray-300 text-black">
                        ETA: Tomorrow by 8 PM
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6 pl-2">
                    <div className="relative pl-6 border-l-2 border-green-600">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-bold text-gray-900">Order Confirmed</p>
                        <p className="text-xs text-gray-500">Today, 10:23 AM</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-yellow-500">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-bold text-gray-900">Shipped</p>
                        <p className="text-xs text-gray-500">Expected today</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-gray-300">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-medium text-gray-400">Out for Delivery</p>
                    </div>
                </div>
            </div>

            {/* Order Details */}
            <div className="bg-white p-6 rounded border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-6">Order Details</h3>

                {/* Product Item */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">Minimalist Analog Watch</h4>
                        <p className="text-xs text-gray-500 mb-1">Qty: 1 · Black Strap</p>
                        <p className="text-sm font-bold text-gray-900">₹2,499</p>
                    </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</p>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{order.shippingAddress?.name || 'Rahul Sharma'}</p>
                            <p>{order.shippingAddress?.addressLine || '1204, Palm Heights, Link Road'}</p>
                            <p>{order.shippingAddress?.city || 'Mumbai'}, {order.shippingAddress?.pincode || '400053'}</p>
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>Visa ending in 4242</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
