import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import Pagination from "../components/Pagination";

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
    // Pagination state (client-side paging for now)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        dashboardAPI.getInventory()
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load inventory");
                setLoading(false);
                console.error(err);
            });
    }, []);

    if (loading) return <MainLayout><div className="text-center py-8">Loading inventory...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    const refresh = () => {
        setLoading(true);
        dashboardAPI.getInventory()
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load inventory");
                setLoading(false);
                console.error(err);
            });
    };

    const total = items.length;
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm({
            name: item.name || "",
            sku: item.sku || "",
            quantity: item.quantity ?? item.stock ?? 0,
            reorderPoint: item.reorderPoint ?? item.reorder ?? 0,
            unitPrice: item.unitPrice ?? 0
        });
        setError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
    };

    const saveEdit = async (id) => {
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
            setError("Failed to update item");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await dashboardAPI.createInventory({
                name: form.name,
                sku: form.sku,
                quantity: Number(form.quantity),
                reorderPoint: Number(form.reorderPoint),
                unitPrice: Number(form.unitPrice)
            });
            setForm({ name: "", sku: "", quantity: 0, reorderPoint: 0, unitPrice: 0 });
            setShowAdd(false);
            refresh();
        } catch (err) {
            console.error(err);
            setError("Failed to add item");
        }
    };

    const handleDelete = async (id) => {
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
                    <button onClick={() => { setShowAdd((s) => !s); setError(""); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <i className="fas fa-plus mr-2"></i> {showAdd ? "Cancel" : "Add Item"}
                    </button>
                    <button onClick={refresh} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Refresh</button>
                </div>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="border p-2 rounded" />
                        <input required value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="SKU" className="border p-2 rounded" />
                        <input required type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="Quantity" className="border p-2 rounded" />
                        <input required type="number" value={form.reorderPoint} onChange={e => setForm({...form, reorderPoint: e.target.value})} placeholder="Reorder Point" className="border p-2 rounded" />
                        <input required type="number" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: e.target.value})} placeholder="Unit Price" className="border p-2 rounded" />
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
                                                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border p-1 rounded w-full" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <input value={editForm.sku} onChange={e => setEditForm({...editForm, sku: e.target.value})} className="border p-1 rounded w-full" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <input type="number" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} className="border p-1 rounded w-24" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <input type="number" value={editForm.reorderPoint} onChange={e => setEditForm({...editForm, reorderPoint: e.target.value})} className="border p-1 rounded w-24" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input type="number" value={editForm.unitPrice} onChange={e => setEditForm({...editForm, unitPrice: e.target.value})} className="border p-1 rounded w-24" />
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
                                                <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
