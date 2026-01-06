import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostPurchasePage from './pages/PostPurchasePage';
import OrderListPage from './pages/OrderListPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import UserCredits from './pages/admin/UserCredits';
import CreditRules from './pages/admin/CreditRules';
import MonetizationSettings from './pages/admin/MonetizationSettings';
import Promotions from './pages/admin/Promotions';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Customer Route - Default */}
                <Route path="/" element={<Navigate to="/order" replace />} />
                <Route path="/order" element={<OrderListPage />} />
                <Route path="/order/:orderId" element={<PostPurchasePage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardOverview />} />
                    <Route path="users" element={<UserCredits />} />
                    <Route path="rules" element={<CreditRules />} />
                    <Route path="monetization" element={<MonetizationSettings />} />
                    <Route path="promotions" element={<Promotions />} />
                    <Route path="reports" element={<ReportsAnalytics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
