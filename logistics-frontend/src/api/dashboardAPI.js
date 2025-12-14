import instance from "./axios";

export const dashboardAPI = {
    // Get KPI data
    getKPIs: async () => {
        const { data } = await instance.get("/dashboard/kpis");
        return data;
    },

    // Get inventory items (paged). page is 0-based.
    getInventory: async (page = 0, size = 10) => {
        const { data } = await instance.get("/inventory", { params: { page, size } });
        return data;
    },

    // Create inventory item
    createInventory: async (payload) => {
        const { data } = await instance.post("/inventory", payload);
        return data;
    },

    // Update inventory item
    updateInventory: async (id, payload) => {
        const { data } = await instance.put(`/inventory/${id}`, payload);
        return data;
    },

    // Delete inventory item
    deleteInventory: async (id) => {
        const { data } = await instance.delete(`/inventory/${id}`);
        return data;
    },

    // Get shipments (paged). page is 0-based.
    getShipments: async (page = 0, size = 10) => {
        const { data } = await instance.get("/shipments", { params: { page, size } });
        return data;
    },
    // Create shipment
    createShipment: async (payload) => {
        const { data } = await instance.post("/shipments", payload);
        return data;
    },

    // Update shipment
    updateShipment: async (id, payload) => {
        const { data } = await instance.put(`/shipments/${id}`, payload);
        return data;
    },

    // Delete shipment
    deleteShipment: async (id) => {
        const { data } = await instance.delete(`/shipments/${id}`);
        return data;
    },

    // Get users (paged). page is 0-based.
    getUsers: async (page = 0, size = 10) => {
        const { data } = await instance.get("/auth/users", { params: { page, size } });
        return data;
    },
    // Create user
    createUser: async (payload) => {
        const { data } = await instance.post("/auth/users", payload);
        return data;
    },

    // Update user
    updateUser: async (id, payload) => {
        const { data } = await instance.put(`/auth/users/${id}`, payload);
        return data;
    },

    // Delete user
    deleteUser: async (id) => {
        const { data } = await instance.delete(`/auth/users/${id}`);
        return data;
    },

    // Generate forecast
    generateForecast: async (payload) => {
        const { data } = await instance.post("/forecasting/generate", payload);
        return data;
    },

    // List forecasts
    listForecasts: async () => {
        const { data } = await instance.get("/forecasting/list");
        return data;
    },

    // Chat with AI
    sendChatMessage: async (message) => {
        const { data } = await instance.post("/chat", { message });
        return data;
    },

    // Generate report
    generateReport: async (payload) => {
        const { data } = await instance.post("/reports/generate", payload);
        return data;
    },

    // List reports (paged). page is 0-based.
    listReports: async (page = 0, size = 10) => {
        const { data } = await instance.get("/reports/list", { params: { page, size } });
        return data;
    },

    // Download report
    downloadReport: async (id) => {
        const { data } = await instance.get(`/reports/${id}/download`, { responseType: 'blob' });
        return data;
    },

    // List audit events (admin only)
    listAuditEvents: async (page = 0, size = 10, filters = {}) => {
        const { data } = await instance.get("/audit", { params: { page, size, ...filters } });
        return data;
    },

    exportAuditCsv: async (filters = {}) => {
        const { data } = await instance.get("/audit/export", { params: { ...filters }, responseType: 'blob' });
        return data;
    },
};
