import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const sections = [
    {
      title: "Main",
      items: [
        { to: "/", icon: "fa-tachometer-alt", label: "Dashboard" },
        { to: "/inventory", icon: "fa-boxes", label: "Inventory" },
        { to: "/logistics", icon: "fa-truck", label: "Logistics" },
        { to: "/forecasting", icon: "fa-chart-line", label: "Forecasting" },
        { to: "/ai-assistant", icon: "fa-robot", label: "AI Assistant" }
      ]
    },
    {
      title: "Reports",
      items: [
        { to: "/reports/inventory", icon: "fa-file-alt", label: "Inventory Reports" },
        { to: "/reports/shipping", icon: "fa-file-invoice", label: "Shipping Reports" },
        { to: "/reports/analytics", icon: "fa-chart-pie", label: "Analytics" }
      ]
    },
    {
      title: "Settings",
      items: [
        { to: "/settings", icon: "fa-cog", label: "System Settings" },
        { to: "/users", icon: "fa-users-cog", label: "User Management" }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto`}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
            <i className="fas fa-industry text-lg" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-lg font-semibold">Apollo</div>
              <div className="text-xs text-gray-300">Logistics Dashboard</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded hover:bg-gray-700 text-gray-300"
        >
          <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`} />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 ring-2 ring-gray-900" title="Online" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="font-medium text-sm">{user?.username || "User"}</div>
              <div className="text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  (user?.role || '').toUpperCase() === 'ADMIN'
                    ? 'bg-yellow-200 text-yellow-900'
                    : 'bg-blue-200 text-blue-900'
                }`}>
                  {(user?.role || 'user').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="p-2 flex-1">
        <Section title="Main" collapsed={collapsed}>
          <NavItem to="/" icon="fa-tachometer-alt" label="Dashboard" collapsed={collapsed} active={isActive("/")} />
          <NavItem to="/inventory" icon="fa-boxes" label="Inventory" collapsed={collapsed} active={isActive("/inventory")} />
          <NavItem to="/logistics" icon="fa-truck" label="Logistics" collapsed={collapsed} active={isActive("/logistics")} />
          <NavItem to="/forecasting" icon="fa-chart-line" label="Forecasting" collapsed={collapsed} active={isActive("/forecasting")} />
          <NavItem to="/ai-assistant" icon="fa-robot" label="AI Assistant" collapsed={collapsed} active={isActive("/ai-assistant")} />
        </Section>

        <Section title="Reports" collapsed={collapsed}>
          <NavItem to="/reports/inventory" icon="fa-file-alt" label="Inventory Reports" collapsed={collapsed} active={isActive("/reports/inventory")} />
          <NavItem to="/reports/shipping" icon="fa-file-invoice" label="Shipping Reports" collapsed={collapsed} active={isActive("/reports/shipping")} />
          <NavItem to="/reports/analytics" icon="fa-chart-pie" label="Analytics" collapsed={collapsed} active={isActive("/reports/analytics")} />
        </Section>

        <Section title="Settings" collapsed={collapsed}>
          <NavItem to="/settings" icon="fa-cog" label="System Settings" collapsed={collapsed} active={isActive("/settings")} />
          <NavItem to="/users" icon="fa-users-cog" label="User Management" collapsed={collapsed} active={isActive("/users")} />
          {(user?.role || '').toUpperCase() === 'ADMIN' && (
            <NavItem to="/admin/audit" icon="fa-clipboard-list" label="Audit Logs" collapsed={collapsed} active={isActive("/admin/audit")} />
          )}
        </Section>
      </nav>

      <div className="px-3 py-3 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-700 text-gray-200">
          <i className="fas fa-sign-out-alt" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function Section({ title, children, collapsed }) {
  return (
    <div className="mb-4">
      {!collapsed && <div className="text-xs uppercase text-gray-500 px-3 py-2">{title}</div>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ to, icon, label, active, collapsed }) {
  const base = "flex items-center px-3 py-3 rounded transition-colors";
  const activeCls = active ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700";
  return (
    <Link to={to} title={label} className={`${base} ${activeCls}`}>
      <div className="w-8 h-8 flex items-center justify-center text-gray-200 mr-3">
        <i className={`fas ${icon}`} />
      </div>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
