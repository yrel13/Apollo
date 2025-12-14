import axios from "axios";

const instance = axios.create({ 
    baseURL: "/api"  // ← Change from "http://localhost:8080/api" to "/api"
});

instance.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// Surface 401/403 nicely
instance.interceptors.response.use(
    (resp) => resp,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            // Defer toast import to avoid circular deps
            import('../utils/toast').then(({ showToast }) => {
                const msg = status === 401 ? 'Please login' : 'Admins only or insufficient permissions';
                showToast(msg, 'error');
            });
        }
        return Promise.reject(error);
    }
);

export default instance;
