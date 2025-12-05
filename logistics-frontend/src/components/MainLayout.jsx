import React from "react";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="text-gray-600 hover:text-gray-900">
                                    <i className="fas fa-bell"></i>
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        3
                                    </span>
                                </button>
                            </div>
                            <div className="relative">
                                <button className="text-gray-600 hover:text-gray-900">
                                    <i className="fas fa-envelope"></i>
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        5
                                    </span>
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <i className="fas fa-search absolute right-3 top-2 text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
