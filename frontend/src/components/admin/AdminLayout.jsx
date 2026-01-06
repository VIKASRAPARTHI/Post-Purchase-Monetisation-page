import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Settings, Gift, BarChart3, LogOut, Bell } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/order/demo'); // Redirect to demo page for now
    };

    const navItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Credits', path: '/admin/users', icon: Users },
        { name: 'Credit Rules', path: '/admin/rules', icon: CreditCard },
        { name: 'Monetization', path: '/admin/monetization', icon: Settings },
        { name: 'Promotions', path: '/admin/promotions', icon: Gift },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-bold text-gray-900">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded transition-all duration-200
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-8">
                    <h2 className="font-bold text-lg text-gray-800">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-9 h-9 bg-gray-200 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
