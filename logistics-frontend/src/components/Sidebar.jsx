import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <div className={`${collapsed ? "w-20" : "w-64"} bg-gray-800 text-white h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-40 overflow-y-auto`}>
            {/* Logo Section */}
            <div className="p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center">
                    <i className="fas fa-industry text-blue-400 text-2xl mr-3"></i>
                    {!collapsed && <span className="font-bold text-xl">Apollo</span>}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-400 hover:text-white"
                >
                    <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
                </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <div className="font-medium text-sm">{user?.username || "User"}</div>
                            <div className="text-xs text-gray-400">{user?.role || "user"}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                {/* Main Section */}
                <div>
                    {!collapsed && <div className="text-xs uppercase text-gray-500 px-3 py-2">Main</div>}
                    <Link
                        to="/"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-tachometer-alt mr-3"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                    <Link
                        to="/inventory"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/inventory")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-boxes mr-3"></i>
                        {!collapsed && <span>Inventory</span>}
                    </Link>
                    <Link
                        to="/logistics"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/logistics")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-truck mr-3"></i>
                        {!collapsed && <span>Logistics</span>}
                    </Link>
                    <Link
                        to="/forecasting"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/forecasting")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-chart-line mr-3"></i>
                        {!collapsed && <span>Forecasting</span>}
                    </Link>
                    <Link
                        to="/ai-assistant"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/ai-assistant")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-robot mr-3"></i>
                        {!collapsed && <span>AI Assistant</span>}
                    </Link>
                </div>

                {/* Reports Section */}
                <div className="mt-6">
                    {!collapsed && <div className="text-xs uppercase text-gray-500 px-3 py-2">Reports</div>}
                    <Link
                        to="/reports/inventory"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/reports/inventory")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-file-alt mr-3"></i>
                        {!collapsed && <span>Inventory Reports</span>}
                    </Link>
                    <Link
                        to="/reports/shipping"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/reports/shipping")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-file-invoice mr-3"></i>
                        {!collapsed && <span>Shipping Reports</span>}
                    </Link>
                    <Link
                        to="/reports/analytics"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/reports/analytics")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-chart-pie mr-3"></i>
                        {!collapsed && <span>Analytics</span>}
                    </Link>
                </div>

                {/* Settings Section */}
                <div className="mt-6">
                    {!collapsed && <div className="text-xs uppercase text-gray-500 px-3 py-2">Settings</div>}
                    <Link
                        to="/settings"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/settings")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-cog mr-3"></i>
                        {!collapsed && <span>System Settings</span>}
                    </Link>
                    <Link
                        to="/users"
                        className={`flex items-center px-3 py-3 rounded mt-1 transition-colors ${
                            isActive("/users")
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                        <i className="fas fa-users-cog mr-3"></i>
                        {!collapsed && <span>User Management</span>}
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-400 hover:text-white w-full transition-colors"
                >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}
