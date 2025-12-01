import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const { register } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ username: "", password: "", firstname: "", lastname: "", email: "", role: "user" });
    const [err, setErr] = useState("");

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try {
            await register(form);
            nav("/login");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Registration failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <form onSubmit={submit} className="p-6 border rounded">
                <h2 className="text-2xl mb-4">Register</h2>
                {err && <div className="text-red-600 mb-2">{err}</div>}
                <input name="username" className="w-full mb-2 p-2 border" value={form.username} onChange={onChange} placeholder="username"/>
                <input name="password" type="password" className="w-full mb-2 p-2 border" value={form.password} onChange={onChange} placeholder="password"/>
                <input name="firstname" className="w-full mb-2 p-2 border" value={form.firstname} onChange={onChange} placeholder="first name"/>
                <input name="lastname" className="w-full mb-2 p-2 border" value={form.lastname} onChange={onChange} placeholder="last name"/>
                <input name="email" className="w-full mb-2 p-2 border" value={form.email} onChange={onChange} placeholder="email"/>
                <select name="role" className="w-full mb-4 p-2 border" value={form.role} onChange={onChange}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <button className="w-full p-2 bg-green-600 text-white">Register</button>
            </form>
        </div>
    );
}
