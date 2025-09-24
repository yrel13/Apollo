import React, { createContext, useState, useContext } from "react";
import axios from "../api/axios";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const role = localStorage.getItem("role"); return role ? { role } : null;
    });

    const login = async (username, password) => {
        const { data } = await axios.post("/auth/login", { username, password });
        if (data?.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            setUser({ role: data.role });
        } else throw new Error("Login failed");
    };

    const logout = () => { localStorage.clear(); setUser(null); };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
