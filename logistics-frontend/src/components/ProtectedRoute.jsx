import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (roles && roles.length > 0) {
        const userRole = (user.role || "").toUpperCase();
        const allowed = roles.map(r => r.toUpperCase()).includes(userRole);
        if (!allowed) return <Navigate to="/" replace />;
    }

    return children;
}
