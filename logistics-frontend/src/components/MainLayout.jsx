import React from "react";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <Sidebar />
            <div className="ml-64 flex-1 flex flex-col overflow-hidden">
                <header className="shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <div className="flex justify-between items-center px-6 py-3">
                            <div>
                            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
                            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Overview & quick actions</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-50">
                                    <i className="fas fa-bell" />
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">3</span>
                                </button>
                            </div>

                            <div className="relative">
                                <button className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-50">
                                    <i className="fas fa-envelope" />
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">5</span>
                                </button>
                            </div>

                            <div className="flex items-center" style={{ backgroundColor: 'transparent', borderRadius: 8, padding: '0.25rem 0.75rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                                <i className="fas fa-search text-gray-400 mr-2" />
                                <input type="text" placeholder="Search reports, items..." className="bg-transparent focus:outline-none text-sm" />
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">U</div>
                                <div className="text-right">
                                    <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{ /* username shown via Sidebar */ }</div>
                                    <div className="text-xs text-gray-500">Administrator</div>
                                </div>
                            </div>

                            {/* Theme toggle removed (reverted to previous theme) */}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
