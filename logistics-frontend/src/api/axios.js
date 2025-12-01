import axios from "axios";

const instance = axios.create({ 
    baseURL: "/api"  // ← Change from "http://localhost:8080/api" to "/api"
});

instance.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default instance;
