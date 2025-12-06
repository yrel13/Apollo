import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import { showToast } from "../utils/toast";
import { validateUserForm } from "../utils/validation";
import Pagination from "../components/Pagination";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ username: "", email: "", role: "user", status: "Active", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        dashboardAPI.getUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load users");
                setLoading(false);
                console.error(err);
            });
    }, []);

    const refreshUsers = async () => {
        try {
            const data = await dashboardAPI.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to refresh users", err);
        }
    };

    const openAdd = () => {
        setEditingUser(null);
        setForm({ username: "", email: "", role: "user", status: "Active", password: "" });
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({ username: user.username || "", email: user.email || "", role: user.role || "user", status: user.status || "Active", password: "" });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const errors = validateUserForm(form);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            showToast('Please fix form errors', 'error');
            return;
        }
        
        try {
            if (editingUser) {
                await dashboardAPI.updateUser(editingUser.id, form);
                showToast('User updated successfully', 'success');
            } else {
                await dashboardAPI.createUser(form);
                showToast('User created successfully', 'success');
            }
            closeModal();
            await refreshUsers();
        } catch (err) {
            console.error(err);
            showToast('Failed to save user', 'error');
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user ${user.username}?`)) return;
        try {
            await dashboardAPI.deleteUser(user.id);
            alert('User deleted');
            await refreshUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to delete user');
        }
    };

    if (loading) return <MainLayout><div className="text-center py-8">Loading users...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    const total = users.length;
    const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i className="fas fa-plus mr-2"></i> Add User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => openEdit(user)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} />
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-30" onClick={closeModal}></div>
                    <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input name="username" value={form.username} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select name="role" value={form.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select name="status" value={form.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                            {!editingUser && (
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input name="password" type="password" value={form.password} onChange={handleChange} required className={`mt-1 block w-full border rounded-md px-3 py-2 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                                </div>
                            )}
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

// Modal markup placed after component for readability (rendered via state inside component)
