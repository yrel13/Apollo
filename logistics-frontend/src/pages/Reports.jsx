import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";
import Pagination from "../components/Pagination";

export default function Reports() {
    const [reportType, setReportType] = useState("inventory");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("30");
    const [format, setFormat] = useState("pdf");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.listReports(page - 1, pageSize);
                setReports(data.content || []);
                setTotal(data.totalElements || 0);
            } catch (err) {
                console.error("Failed to load reports", err);
                setReports([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, [page, pageSize]);

    const handleGenerateReport = async () => {
        try {
            await dashboardAPI.generateReport({
                reportType,
                dateRange: parseInt(dateRange),
                format,
            });
            alert('Report generation started');
            // Reload reports list
            const data = await dashboardAPI.listReports(page - 1, pageSize);
            setReports(data.content || []);
            setTotal(data.totalElements || 0);
        } catch (err) {
            console.error(err);
            alert('Failed to generate report');
        }
    };

    const handleDownloadReport = async (report) => {
        try {
            const blob = await dashboardAPI.downloadReport(report.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = report.name || 'report';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert('Failed to download report');
        }
    };

    if (loading) return <MainLayout><div className="text-center py-8">Loading reports...</div></MainLayout>;

    const paginatedReports = reports; // reports are server-page content

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

            {/* Report Type Tabs */}
            <div className="flex space-x-4 mb-6">
                {["inventory", "shipping", "analytics"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setReportType(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            reportType === type
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {type === "inventory" && "Inventory Reports"}
                        {type === "shipping" && "Shipping Reports"}
                        {type === "analytics" && "Analytics"}
                    </button>
                ))}
            </div>

            {/* Generate Report Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="180">Last 6 months</option>
                            <option value="365">Last year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                        <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleGenerateReport} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                            <i className="fas fa-download mr-2"></i> Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Generated Reports</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Generated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            report.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.fileSize}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => handleDownloadReport(report)} className="text-blue-600 hover:text-blue-900 mr-3">
                                            <i className="fas fa-download"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} />
        </MainLayout>
    );
}
