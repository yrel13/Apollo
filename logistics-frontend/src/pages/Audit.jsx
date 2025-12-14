import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import Pagination from "../components/Pagination";
import { showToast } from "../utils/toast";

export default function Audit() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ username: "", action: "", from: "", to: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.listAuditEvents(page - 1, pageSize, cleanupFilters(filters));
        setEvents(data.content || []);
        setTotal(data.totalElements || 0);
      } catch (err) {
        setError("Failed to load audit events");
        showToast(err?.response?.data?.message || "Failed to load audit events", 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize]);
  
  const cleanupFilters = (f) => {
    const out = {};
    if (f.username) out.username = f.username;
    if (f.action) out.action = f.action;
    if (f.from) out.from = new Date(f.from).toISOString();
    if (f.to) out.to = new Date(f.to).toISOString();
    return out;
  };

  const updateFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => { setPage(1); };

  const exportCsv = async () => {
    try {
      const blob = await dashboardAPI.exportAuditCsv(cleanupFilters(filters));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'audit.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  if (loading) return <MainLayout><div className="text-center py-8">Loading audit events...</div></MainLayout>;
  if (error) return <MainLayout><div className="text-red-600 text-center py-8">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-b">
          <input name="username" value={filters.username} onChange={updateFilter} placeholder="Filter by user" className="border p-2 rounded" />
          <select name="action" value={filters.action} onChange={updateFilter} className="border p-2 rounded">
            <option value="">All actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input type="date" name="from" value={filters.from} onChange={updateFilter} className="border p-2 rounded" />
          <input type="date" name="to" value={filters.to} onChange={updateFilter} className="border p-2 rounded" />
          <div className="flex gap-2">
            <button onClick={applyFilters} className="bg-blue-600 text-white px-3 py-2 rounded">Apply</button>
            <button onClick={exportCsv} className="bg-gray-200 text-gray-700 px-3 py-2 rounded">Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ev.at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ev.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">{ev.action}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ev.resource}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={total} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} />
      </div>
    </MainLayout>
  );
}
