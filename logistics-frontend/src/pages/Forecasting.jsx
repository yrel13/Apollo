import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";

export default function Forecasting() {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState("MOD-PMP-100");
    const [forecastPeriod, setForecastPeriod] = useState("90");

    useEffect(() => {
        const loadForecasts = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.listForecasts();
                setForecasts(data || []);
            } catch (err) {
                console.error("Failed to load forecasts", err);
                setForecasts([]);
            } finally {
                setLoading(false);
            }
        };
        loadForecasts();
    }, []);

    const handleGenerateForecast = async () => {
        try {
            const response = await dashboardAPI.generateForecast({
                product: selectedProduct,
                forecastPeriod: parseInt(forecastPeriod),
            });
            
            // Extract summary from response
            if (response.summary) {
                const summary = response.summary;
                // Update the results preview section with actual data
                document.getElementById('expected-demand').textContent = `${Math.round(summary.total_forecast)} units`;
                document.getElementById('optimal-inventory').textContent = `${Math.round(summary.optimal_inventory)} units`;
                document.getElementById('confidence').textContent = `${Math.round(summary.confidence * 100)}% confidence`;
            }
            
            alert('Forecast generated successfully');
            // Reload forecasts
            const data = await dashboardAPI.listForecasts();
            setForecasts(data || []);
        } catch (err) {
            console.error(err);
            alert('Failed to generate forecast. Make sure Python service is running on port 8000.');
        }
    };

    if (loading) return <MainLayout><div className="text-center py-8">Loading forecasting data...</div></MainLayout>;

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">AI Demand Forecasting</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Forecast Tool */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Generate Forecast</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="MOD-PMP-100">Industrial Pumps (MOD-PMP-100)</option>
                                <option value="MOD-VLV-200">Valve Assemblies (MOD-VLV-200)</option>
                                <option value="MOD-CTL-300">Control Panels (MOD-CTL-300)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Period (days)</label>
                            <select
                                value={forecastPeriod}
                                onChange={(e) => setForecastPeriod(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="30">Next 30 days</option>
                                <option value="90">Next 90 days</option>
                                <option value="180">Next 6 months</option>
                                <option value="365">Next 12 months</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerateForecast}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <i className="fas fa-brain mr-2"></i> Generate AI Forecast
                        </button>
                    </div>
                </div>

                {/* Results Preview */}
                <div className="bg-blue-50 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Latest Results</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Expected Demand</span>
                                <span id="expected-demand" className="text-sm font-bold">1,850 units</span>
                            </div>
                            <div id="confidence" className="text-xs text-gray-600">± 5.2% confidence</div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Optimal Inventory</span>
                                <span id="optimal-inventory" className="text-sm font-bold">2,200 units</span>
                            </div>
                            <div className="text-xs text-gray-600">95% service level</div>
                        </div>
                        <div className="pt-4 border-t border-blue-200">
                            <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                            <ul className="text-xs space-y-2">
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-up text-green-500 mr-2 mt-0.5"></i>
                                    <span>AI-powered predictions</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-calendar text-blue-500 mr-2 mt-0.5"></i>
                                    <span>Trend analysis included</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forecast Results Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">All Forecasts</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Demand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Optimal Inventory</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {forecasts.map((forecast, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{forecast.product}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.expectedDemand} units</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.optimalInventory} units</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.reorderPoint} units</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600">{forecast.accuracy}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
