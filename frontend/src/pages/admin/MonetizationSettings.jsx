import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rocket, Lock, Crown, Info, Save, RotateCw, History } from 'lucide-react';

const MonetizationSettings = () => {
    const [settings, setSettings] = useState({
        creditBooster: { price: 49, multiplier: 2, enabled: true, description: 'Double your credits instantly' },
        earlyUnlock: { fee: 29, enabled: false, description: 'Use credits instantly instead of waiting' },
        premiumWallet: {
            price: 99,
            name: 'Future Me Gold',
            enabled: true,
            benefits: {
                noExpiry: true,
                extraBoost: true,
                exclusiveDeals: true,
                prioritySupport: false
            }
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/settings');
            // Merge defaults with fetched data
            if (Object.keys(response.data).length > 0) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error loading settings:", error);
            setLoading(false);
        }
    };

    const handleSave = async (key, value) => {
        try {
            await axios.post('http://localhost:5001/api/admin/settings', {
                key,
                value
            });
            alert('Settings saved successfully!');
            fetchSettings(); // Refresh to ensure sync
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings.');
        }
    };

    // Helper handlers for nested updates
    const updateSetting = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Monetization Feature Configuration</h1>
                    <p className="text-gray-500">Manage pricing strategies, subscription benefits, and feature availability.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <History className="w-4 h-4" /> View Logs
                    </button>
                    <button onClick={fetchSettings} className="btn-primary flex items-center gap-2">
                        <RotateCw className="w-4 h-4" /> Global Sync
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Credit Booster Config */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <Rocket className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Credit Booster</h3>
                        </div>
                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                className="w-6 h-6 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                checked={settings.creditBooster.enabled}
                                onChange={(e) => updateSetting('creditBooster', 'enabled', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={settings.creditBooster.description}
                                onChange={(e) => updateSetting('creditBooster', 'description', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">One-time Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={settings.creditBooster.price}
                                        onChange={(e) => updateSetting('creditBooster', 'price', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg pl-8 p-2.5 bg-gray-50 text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Boost Multiplier</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={settings.creditBooster.multiplier}
                                        onChange={(e) => updateSetting('creditBooster', 'multiplier', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-l-lg p-2.5 bg-gray-50 text-sm font-medium"
                                    />
                                    <span className="bg-gray-100 border border-l-0 border-gray-200 p-2.5 rounded-r-lg text-gray-500 font-bold text-sm">x</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-2">
                            <button
                                onClick={() => handleSave('creditBooster', settings.creditBooster)}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Early Unlock Config */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Early Unlock</h3>
                        </div>
                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                                checked={settings.earlyUnlock.enabled}
                                onChange={(e) => updateSetting('earlyUnlock', 'enabled', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className={!settings.earlyUnlock.enabled ? "opacity-50 pointer-events-none space-y-4" : "space-y-4"}>
                        {!settings.earlyUnlock.enabled && (
                            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4" /> Feature is currently inactive
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={settings.earlyUnlock.description}
                                onChange={(e) => updateSetting('earlyUnlock', 'description', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Unlock Fee</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={settings.earlyUnlock.fee}
                                    onChange={(e) => updateSetting('earlyUnlock', 'fee', Number(e.target.value))}
                                    className="w-full border border-gray-200 rounded-lg pl-8 p-2.5 bg-gray-50 text-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="pt-4 mt-2">
                            <button
                                onClick={() => handleSave('earlyUnlock', settings.earlyUnlock)}
                                className="w-full btn-secondary flex items-center justify-center gap-2 pointer-events-auto"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Premium Wallet Config */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                                <Crown className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Premium Wallet Subscription</h3>
                        </div>
                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                className="w-6 h-6 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                checked={settings.premiumWallet.enabled}
                                onChange={(e) => updateSetting('premiumWallet', 'enabled', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subscription Name</label>
                                <input
                                    type="text"
                                    value={settings.premiumWallet.name}
                                    onChange={(e) => updateSetting('premiumWallet', 'name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Monthly Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={settings.premiumWallet.price}
                                        onChange={(e) => updateSetting('premiumWallet', 'price', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg pl-8 p-2.5 bg-gray-50 text-sm font-medium"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">/ month</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                Changes to price will only affect new subscribers. Existing subscribers are grandfathered into their current rate.
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Included Benefits</label>
                            <div className="space-y-3">
                                {[
                                    { key: 'noExpiry', text: 'Credits never expire' },
                                    { key: 'extraBoost', text: 'Extra 1.5x monthly boost' },
                                    { key: 'exclusiveDeals', text: 'Exclusive deals access' },
                                    { key: 'prioritySupport', text: 'Priority support' },
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={settings.premiumWallet.benefits[benefit.key]}
                                            onChange={(e) => {
                                                const newBenefits = { ...settings.premiumWallet.benefits, [benefit.key]: e.target.checked };
                                                updateSetting('premiumWallet', 'benefits', newBenefits);
                                            }}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleSave('premiumWallet', settings.premiumWallet)}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Subscription Config
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MonetizationSettings;
