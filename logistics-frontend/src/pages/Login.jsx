import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login(){
    const { login } = useAuth(); const nav = useNavigate();
    const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try { await login(u,p); nav("/"); } catch(e){ setErr("Login failed"); }
    };

    return (
        <div className="max-w-md mx-auto mt-20"> 
            <form onSubmit={submit} className="p-6 border rounded">
                <h2 className="text-2xl mb-4">Login</h2>
                {err && <div className="text-red-600 mb-2">{err}</div>}
                <input className="w-full mb-2 p-2 border" value={u} onChange={e=>setU(e.target.value)} placeholder="username"/>
                <input className="w-full mb-2 p-2 border" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="password"/>
                <button className="w-full p-2 bg-blue-600 text-white">Login</button>
                <div className="text-center mt-3">
                    <Link to="/register" className="text-sm text-blue-600">Don't have an account? Register</Link>
                </div>
            </form>
        </div>
    );
}
