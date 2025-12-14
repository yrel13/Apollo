import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import Pagination from "../components/Pagination";
import { parseApiError } from "../utils/apiErrors";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

export default function Logistics() {
    const { user } = useAuth();
    const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [form, setForm] = useState({ orderNumber: "", destination: "", status: "Processing", eta: "", delay: 0 });
    const [formErrors, setFormErrors] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.getShipments(page - 1, pageSize);
                setShipments(data.content || []);
                setTotal(data.totalElements || 0);
                setLoading(false);
            } catch (err) {
                setError("Failed to load shipments");
                setLoading(false);
                console.error(err);
            }
        };
        load();
    }, [page, pageSize]);

    const refreshShipments = async () => {
        try {
            const data = await dashboardAPI.getShipments(page - 1, pageSize);
            setShipments(data.content || []);
            setTotal(data.totalElements || 0);
        } catch (err) {
            console.error('Failed to refresh shipments', err);
        }
    };

    const openAdd = () => {
        setEditingShipment(null);
        setForm({ orderNumber: "", destination: "", status: "Processing", eta: "", delay: 0 });
        setFormErrors({});
        setModalOpen(true);
    };

    const openEdit = (s) => {
        setEditingShipment(s);
        // Backend exposes orderNumber and eta may be ISO string; normalize to date-only for the input
        const etaStr = s.eta ? (typeof s.eta === 'string' ? s.eta.split('T')[0] : s.eta) : "";
        setForm({ orderNumber: s.orderNumber || "", destination: s.destination || "", status: s.status || "Processing", eta: etaStr, delay: s.delay || 0 });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingShipment(null);
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'delay' ? Number(value) : value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) { showToast('Admins only', 'error'); return; }
        try {
            // Prepare payload matching backend Shipment entity
            const payload = {
                orderNumber: form.orderNumber,
                destination: form.destination,
                status: form.status,
            };
            if (form.eta) {
                // convert date-only (YYYY-MM-DD) to LocalDateTime-like string
                payload.eta = `${form.eta}T00:00:00`;
            }
            if (editingShipment) {
                await dashboardAPI.updateShipment(editingShipment.id, payload);
                showToast('Shipment updated', 'success');
            } else {
                await dashboardAPI.createShipment(payload);
                showToast('Shipment created', 'success');
            }
            closeModal();
            await refreshShipments();
        } catch (err) {
            console.error(err);
            const { message, fieldErrors } = parseApiError(err);
            setFormErrors(fieldErrors);
            showToast(message, 'error');
        }
    };

    const handleDelete = async (s) => {
        if (!isAdmin) { showToast('Admins only', 'error'); return; }
        if (!window.confirm(`Cancel shipment ${s.orderNumber}?`)) return;
        try {
            await dashboardAPI.deleteShipment(s.id);
            alert('Shipment canceled');
            await refreshShipments();
        } catch (err) {
            console.error(err);
            alert('Failed to cancel shipment');
        }
    };

    if (loading) return <MainLayout><div className="text-center py-8">Loading shipments...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    const paginatedShipments = shipments; // shipments are server-page content

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
                {isAdmin && (
                    <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <i className="fas fa-plus mr-2"></i> Create Shipment
                    </button>
                )}
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
                            {paginatedShipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.orderNumber}</td>
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
                                        {isAdmin ? (
                                            <>
                                                <button onClick={() => openEdit(shipment)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                <button onClick={() => handleDelete(shipment)} className="text-red-600 hover:text-red-900">Cancel</button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">View only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} />
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-30" onClick={closeModal}></div>
                    <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">{editingShipment ? 'Edit Shipment' : 'Create Shipment'}</h2>
                        {isAdmin ? (
                            <div className="mb-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                                Admins only: shipment changes require ADMIN role.
                            </div>
                        ) : (
                            <div className="mb-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                                You have read-only access.
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Order #</label>
                                <input name="orderNumber" value={form.orderNumber} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.orderNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.orderNumber && <p className="text-xs text-red-600 mt-1">{formErrors.orderNumber}</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Destination</label>
                                <input name="destination" value={form.destination} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.destination ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.destination && <p className="text-xs text-red-600 mt-1">{formErrors.destination}</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select name="status" value={form.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option>Processing</option>
                                    <option>In Transit</option>
                                    <option>Delayed</option>
                                    <option>Delivered</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">ETA</label>
                                <input name="eta" value={form.eta} onChange={handleChange} placeholder="YYYY-MM-DD" className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.eta ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.eta && <p className="text-xs text-red-600 mt-1">{formErrors.eta}</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Delay (days)</label>
                                <input name="delay" type="number" value={form.delay} onChange={handleChange} className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.delay ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.delay && <p className="text-xs text-red-600 mt-1">{formErrors.delay}</p>}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="button" onClick={closeModal} className="mr-3 px-4 py-2 rounded-md border">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
