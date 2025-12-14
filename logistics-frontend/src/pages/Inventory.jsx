import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import Pagination from "../components/Pagination";
import { parseApiError } from "../utils/apiErrors";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

export default function Inventory() {
    const { user } = useAuth();
    const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
    const [editErrors, setEditErrors] = useState({});
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const handleAddChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        if (editErrors[field]) {
            setEditErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    // load when page or pageSize change
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.getInventory(page - 1, pageSize);
                // backend returns Page object: { content, totalElements, totalPages, number, size }
                setItems(data.content || []);
                setTotal(data.totalElements || 0);
                setLoading(false);
            } catch (err) {
                setError("Failed to load inventory");
                setLoading(false);
                console.error(err);
            }
        };
        load();
    }, [page, pageSize]);

    if (loading) return <MainLayout><div className="text-center py-8">Loading inventory...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    const refresh = async () => {
        try {
            setLoading(true);
            const data = await dashboardAPI.getInventory(page - 1, pageSize);
            setItems(data.content || []);
            setTotal(data.totalElements || 0);
        } catch (err) {
            setError("Failed to load inventory");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const paginatedItems = items; // items are server-page content

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm({
            name: item.name || "",
            sku: item.sku || "",
            quantity: item.quantity ?? item.stock ?? 0,
            reorderPoint: item.reorderPoint ?? item.reorder ?? 0,
            unitPrice: item.unitPrice ?? 0
        });
        setEditErrors({});
        setError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
        setEditErrors({});
    };

    const saveEdit = async (id) => {
        if (!isAdmin) { showToast("Admins only", "error"); return; }
        try {
            await dashboardAPI.updateInventory(id, {
                name: editForm.name,
                sku: editForm.sku,
                quantity: Number(editForm.quantity),
                reorderPoint: Number(editForm.reorderPoint),
                unitPrice: Number(editForm.unitPrice)
            });
            cancelEdit();
            refresh();
        } catch (err) {
            console.error(err);
            const { message, fieldErrors } = parseApiError(err);
            setEditErrors(fieldErrors);
            setError("Failed to update item");
            showToast(message, "error");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!isAdmin) { showToast("Admins only", "error"); return; }
        try {
            await dashboardAPI.createInventory({
                name: form.name,
                sku: form.sku,
                quantity: Number(form.quantity),
                reorderPoint: Number(form.reorderPoint),
                unitPrice: Number(form.unitPrice)
            });
            setForm({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
            setFormErrors({});
            setShowAdd(false);
            refresh();
        } catch (err) {
            console.error(err);
            const { message, fieldErrors } = parseApiError(err);
            setFormErrors(fieldErrors);
            setError("Failed to add item");
            showToast(message, "error");
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) { showToast("Admins only", "error"); return; }
        if (!confirm("Delete this item?")) return;
        try {
            await dashboardAPI.deleteInventory(id);
            refresh();
        } catch (err) {
            console.error(err);
            setError("Failed to delete item");
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={() => { setShowAdd((s) => !s); setError(""); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <i className="fas fa-plus mr-2"></i> {showAdd ? "Cancel" : "Add Item"}
                        </button>
                    )}
                    <button onClick={refresh} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Refresh</button>
                </div>
            </div>

            {showAdd && isAdmin && (
                <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="mb-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                        Admins only: creating items requires ADMIN role.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div>
                            <input required value={form.name} onChange={e => handleAddChange('name', e.target.value)} placeholder="Name" className={`border p-2 rounded w-full ${formErrors.name ? 'border-red-500' : ''}`} />
                            {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <input required value={form.sku} onChange={e => handleAddChange('sku', e.target.value)} placeholder="SKU" className={`border p-2 rounded w-full ${formErrors.sku ? 'border-red-500' : ''}`} />
                            {formErrors.sku && <p className="text-xs text-red-600 mt-1">{formErrors.sku}</p>}
                        </div>
                        <div>
                            <input required type="number" value={form.quantity} onChange={e => handleAddChange('quantity', e.target.value)} placeholder="Quantity" className={`border p-2 rounded w-full ${formErrors.quantity ? 'border-red-500' : ''}`} />
                            {formErrors.quantity && <p className="text-xs text-red-600 mt-1">{formErrors.quantity}</p>}
                        </div>
                        <div>
                            <input required type="number" value={form.reorderPoint} onChange={e => handleAddChange('reorderPoint', e.target.value)} placeholder="Reorder Point" className={`border p-2 rounded w-full ${formErrors.reorderPoint ? 'border-red-500' : ''}`} />
                            {formErrors.reorderPoint && <p className="text-xs text-red-600 mt-1">{formErrors.reorderPoint}</p>}
                        </div>
                        <div>
                            <input required type="number" value={form.unitPrice} onChange={e => handleAddChange('unitPrice', e.target.value)} placeholder="Unit Price" className={`border p-2 rounded w-full ${formErrors.unitPrice ? 'border-red-500' : ''}`} />
                            {formErrors.unitPrice && <p className="text-xs text-red-600 mt-1">{formErrors.unitPrice}</p>}
                        </div>
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Item</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {editingId === item.id ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input value={editForm.name} onChange={e => handleEditChange('name', e.target.value)} className={`border p-1 rounded w-full ${editErrors.name ? 'border-red-500' : ''}`} />
                                                {editErrors.name && <p className="text-xs text-red-600 mt-1">{editErrors.name}</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <input value={editForm.sku} onChange={e => handleEditChange('sku', e.target.value)} className={`border p-1 rounded w-full ${editErrors.sku ? 'border-red-500' : ''}`} />
                                                {editErrors.sku && <p className="text-xs text-red-600 mt-1">{editErrors.sku}</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <input type="number" value={editForm.quantity} onChange={e => handleEditChange('quantity', e.target.value)} className={`border p-1 rounded w-24 ${editErrors.quantity ? 'border-red-500' : ''}`} />
                                                {editErrors.quantity && <p className="text-xs text-red-600 mt-1">{editErrors.quantity}</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <input type="number" value={editForm.reorderPoint} onChange={e => handleEditChange('reorderPoint', e.target.value)} className={`border p-1 rounded w-24 ${editErrors.reorderPoint ? 'border-red-500' : ''}`} />
                                                {editErrors.reorderPoint && <p className="text-xs text-red-600 mt-1">{editErrors.reorderPoint}</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input type="number" value={editForm.unitPrice} onChange={e => handleEditChange('unitPrice', e.target.value)} className={`border p-1 rounded w-24 ${editErrors.unitPrice ? 'border-red-500' : ''}`} />
                                                {editErrors.unitPrice && <p className="text-xs text-red-600 mt-1">{editErrors.unitPrice}</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick={() => saveEdit(item.id)} className="text-green-600 hover:text-green-800 mr-3">Save</button>
                                                <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.sku}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity ?? item.stock} units</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reorderPoint ?? item.reorder} units</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status === "Critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isAdmin ? (
                                                    <>
                                                        <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">View only</span>
                                                )}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} />
            </div>
        </MainLayout>
    );
}
