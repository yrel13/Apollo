import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) return <MainLayout><div className="text-center py-8">Loading users...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
                            {users.map((user) => (
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
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
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
