import instance from "./axios";

export const dashboardAPI = {
    // Get KPI data
    getKPIs: async () => {
        const { data } = await instance.get("/dashboard/kpis");
        return data;
    },

    // Get inventory items
    getInventory: async () => {
        const { data } = await instance.get("/inventory");
        return data;
    },

    // Get shipments
    getShipments: async () => {
        const { data } = await instance.get("/shipments");
        return data;
    },

    // Get users
    getUsers: async () => {
        const { data } = await instance.get("/auth/users");
        return data;
    },
};
