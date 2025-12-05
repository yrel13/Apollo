import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";

export default function Logistics() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        dashboardAPI.getShipments()
            .then(data => {
                setShipments(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load shipments");
                setLoading(false);
                console.error(err);
            });
    }, []);

    if (loading) return <MainLayout><div className="text-center py-8">Loading shipments...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    const getStatusColor = (status) => {
        switch (status) {
            case "In Transit":
                return "bg-green-100 text-green-800";
            case "Delayed":
                return "bg-red-100 text-red-800";
            case "Processing":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Logistics & Shipments</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i className="fas fa-plus mr-2"></i> Create Shipment
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ETA</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delay</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.order}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shipment.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.eta}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={shipment.delay > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                                            {shipment.delay > 0 ? `+${shipment.delay} days` : "On time"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Track</button>
                                        <button className="text-red-600 hover:text-red-900">Cancel</button>
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
