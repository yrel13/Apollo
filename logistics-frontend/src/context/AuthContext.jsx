import React, { createContext, useState, useContext } from "react";
import axios from "../api/axios";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");
        return role ? { role, username } : null;
    });

    const login = async (username, password) => {
        const { data } = await axios.post("/auth/login", { username, password });
        if (data?.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            setUser({ role: data.role, username: data.username });
        } else throw new Error("Login failed");
    };

    const register = async (userData) => {
        // userData should include: username, password, firstname, lastname, email, role
        const { data } = await axios.post("/auth/register", userData);
        return data;
    };

    const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); localStorage.removeItem("username"); setUser(null); };

    return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
