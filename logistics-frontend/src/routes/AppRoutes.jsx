import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Logistics from "../pages/Logistics";
import Forecasting from "../pages/Forecasting";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import AIAssistant from "../pages/AIAssistant";
import UserManagement from "../pages/UserManagement";
import Audit from "../pages/Audit";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>}/>
        <Route path="/logistics" element={<ProtectedRoute><Logistics/></ProtectedRoute>}/>
        <Route path="/forecasting" element={<ProtectedRoute><Forecasting/></ProtectedRoute>}/>
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant/></ProtectedRoute>}/>
        <Route path="/reports/inventory" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
        <Route path="/reports/shipping" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
        <Route path="/reports/analytics" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
        <Route path="/users" element={<ProtectedRoute roles={["ADMIN"]}><UserManagement/></ProtectedRoute>}/>
        <Route path="/admin/audit" element={<ProtectedRoute roles={["ADMIN"]}><Audit/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
