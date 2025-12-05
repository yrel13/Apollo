import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState({ appName: "Apollo", theme: "dark", notifications: true });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Placeholder: Load settings from API
    }, []);

    const handleSave = () => {
        // Placeholder: Save settings to API
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Navigation */}
                <div className="bg-white rounded-lg shadow">
                    <nav className="divide-y divide-gray-200">
                        {["general", "users", "backup", "security"].map((section) => (
                            <button
                                key={section}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 capitalize font-medium text-gray-700"
                            >
                                <i className={`fas ${
                                    section === "general" ? "fa-cog" :
                                    section === "users" ? "fa-users" :
                                    section === "backup" ? "fa-database" :
                                    "fa-lock"
                                } mr-2`}></i>
                                {section}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                                <input
                                    type="text"
                                    value={settings.appName}
                                    onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Enable notifications</label>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Your Account</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Username</label>
                                <p className="text-gray-900">{user?.username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Role</label>
                                <p className="text-gray-900">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Save Changes
                        </button>
                        {saved && <span className="text-green-600 font-medium">✓ Settings saved</span>}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
