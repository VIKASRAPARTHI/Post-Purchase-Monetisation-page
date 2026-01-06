import React from 'react';
import { Package } from 'lucide-react';

const OrderDetails = ({ order }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
                {/* Custom Order Details Column */}
                <div>
                    <h3 className="text-blue-600 font-bold mb-6 text-lg">Order Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Order No:</p>
                            <p className="text-gray-600 text-sm">{order.orderId || '123456'}</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Payment Method:</p>
                            <p className="text-gray-600 text-sm">Credit Card (Visa ending in 4242)</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Order Date:</p>
                            <p className="text-gray-600 text-sm">Oct 10, 2024</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Order Time:</p>
                            <p className="text-gray-600 text-sm">08:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Customer Details Column */}
                <div>
                    <h3 className="text-blue-600 font-bold mb-6 text-lg">Customer Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Customer Name:</p>
                            <p className="text-gray-600 text-sm">{order.shippingAddress?.name || 'Rahul Sharma'}</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Customer Email:</p>
                            <p className="text-gray-600 text-sm">rahul.sharma@email.com</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Shipping Address:</p>
                            <p className="text-gray-600 text-sm">
                                {order.shippingAddress?.addressLine || '1204, Palm Heights, Link Road,'}<br />
                                {order.shippingAddress?.city || 'Andheri West, Mumbai'}, {order.shippingAddress?.pincode || '400053'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div>
                <h3 className="text-blue-600 font-bold mb-6 text-lg">Product Details</h3>

                {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between mb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                                {item.image && !item.image.includes('placehold') ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full border-2 border-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-300 text-[8px]">Img</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                <p className="text-gray-500 text-sm mt-1">
                                    Premium product
                                </p>
                            </div>
                        </div>
                        <div className="text-right flex gap-12 items-center">
                            <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                            <div className="font-bold text-gray-900">₹{item.price?.toLocaleString()}</div>
                        </div>
                    </div>
                ))}

                {/* Footer Totals */}
                <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-end mb-2">
                        <div className="w-64 flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-end mb-4">
                        <div className="w-64 flex justify-between text-sm">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-64 flex justify-between text-lg">
                            <span className="font-bold text-gray-900">Total:</span>
                            <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
