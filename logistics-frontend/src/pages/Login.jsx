import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const { login } = useAuth(); const nav = useNavigate();
    const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try { await login(u,p); nav("/"); } catch(e){ setErr("Login failed"); }
    };

    return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
     <form
       onSubmit={submit}
       className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md"
     >
       <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>
       {err && <div className="text-red-600 mb-2">{err}</div>}
       <input
         className="w-full mb-3 p-2 border rounded"
         value={u}
         onChange={e => setU(e.target.value)}
         placeholder="Username"
       />
       <input
         className="w-full mb-3 p-2 border rounded"
         type="password"
         value={p}
         onChange={e => setP(e.target.value)}
         placeholder="Password"
       />
       <button
         className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
       >
         Login
       </button>
     </form>
   </div>
 );
}
