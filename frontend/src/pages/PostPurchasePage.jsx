import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OrderConfirmation from '../components/OrderConfirmation';
import CreditWalletHero from '../components/CreditWalletHero';
import MonetizationCards from '../components/MonetizationCards';
import OrderDetails from '../components/OrderDetails';
import ExclusiveDropCard from '../components/ExclusiveDropCard';
import { ShieldCheck, MessageSquare } from 'lucide-react';

const PostPurchasePage = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null);
    const [credits, setCredits] = useState({
        balance: 0,
        locked: 0
    });

    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Fetch Settings first to ensure UI is consistent
                const settingsRes = await axios.get('/api/admin/settings');
                setSettings(settingsRes.data);

                // Fetch Order
                // Using hardcoded orderId '123456' from seed data if param is not provided or matches mock default
                const targetOrderId = orderId || '123456';
                const response = await axios.get(`/api/orders/${targetOrderId}`);
                setOrder(response.data);

                // Initialize credits based on order (Use dynamic potential if available for demo variability)
                if (response.data.currentPotentialCredits || response.data.creditsEarned) {
                    setCredits(prev => ({ ...prev, locked: response.data.currentPotentialCredits || response.data.creditsEarned }));
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleUpdate = () => {
        // Refresh credit data after a purchase - fetch updated wallet
        // For demo, just doubling the locked amount locally
        setCredits(prev => ({
            ...prev,
            locked: prev.locked * 2
        }));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return <div className="min-h-screen flex items-center justify-center">Order not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans pb-20">
            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                        <div className="w-8 h-8 bg-[#EAB308] rounded-lg"></div> LuxeCart
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-black">My Orders</a>
                        <a href="#" className="hover:text-black">Profile</a>
                        <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto pt-8 px-6">

                {/* Top Banner: Order Confirmation */}
                <div className="mb-8">
                    <OrderConfirmation order={order} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Order Details */}
                    <div className="lg:col-span-2">
                        <OrderDetails order={order} />
                    </div>

                    {/* Right Column: Monetization & Rewards */}
                    <div className="lg:col-span-1">
                        {/* 1. Future Reward Card */}
                        <CreditWalletHero credits={credits} loading={loading} orderAmount={order.totalAmount} />

                        {/* 2. Exclusive Drop */}
                        <ExclusiveDropCard />

                        {/* 3. Grow Credits & Premium Wallet */}
                        <MonetizationCards
                            userId="user123"
                            onUpdate={handleUpdate}
                            settings={settings}
                            lockedCredits={credits.locked}
                        />
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="border-t border-gray-100 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Secure Payment & Trust
                    </div>

                    <div className="flex gap-6">
                        <button className="flex items-center gap-2 hover:text-gray-600"><MessageSquare className="w-4 h-4" /> Chat Support</button>
                        <button className="hover:text-gray-600">FAQs</button>
                        <button className="hover:text-gray-600">Return Policy</button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PostPurchasePage;
