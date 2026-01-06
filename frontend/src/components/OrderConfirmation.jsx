import React from 'react';
import { CheckCircle, Truck } from 'lucide-react';

const OrderConfirmation = ({ order }) => {
    if (!order) return null;

    return (
        <div className="bg-gray-100 rounded-xl p-6 flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Thank you for your order, Rahul!</h1>
                <p className="text-gray-500 text-sm">
                    A confirmation email has been sent to rahul.sharma@email.com
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmation;
