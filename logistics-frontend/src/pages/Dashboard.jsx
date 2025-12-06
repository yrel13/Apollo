import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [kpis, setKpis] = useState({ inventoryValue: 0, lowStockItems: 0, pendingShipments: 0, forecastAccuracy: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.getKPIs();
                setKpis(data);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <MainLayout><div className="text-center py-8">Loading dashboard...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    return (
        <MainLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Inventory Value Card */}
                <div onClick={() => navigate("/inventory")} className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Total Inventory Value</p>
                            <h3 className="text-2xl font-bold">${kpis.inventoryValue.toLocaleString()}</h3>
                            <p className="text-green-500 text-sm mt-1">+2.5% from last month</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <i className="fas fa-boxes text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Low Stock Items Card */}
                <div onClick={() => navigate("/inventory")} className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Low Stock Items</p>
                            <h3 className="text-2xl font-bold">{kpis.lowStockItems}</h3>
                            <p className="text-red-500 text-sm mt-1">Require immediate attention</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Pending Shipments Card */}
                <div onClick={() => navigate("/logistics")} className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Pending Shipments</p>
                            <h3 className="text-2xl font-bold">{kpis.pendingShipments}</h3>
                            <p className="text-yellow-500 text-sm mt-1">5 delayed shipments</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <i className="fas fa-truck text-yellow-500 text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* AI Forecast Accuracy Card */}
                <div onClick={() => navigate("/forecasting")} className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">AI Forecast Accuracy</p>
                            <h3 className="text-2xl font-bold">{kpis.forecastAccuracy}%</h3>
                            <p className="text-green-500 text-sm mt-1">+3.2% improvement</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <i className="fas fa-brain text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional sections can be added here */}
        </MainLayout>
    );
}
