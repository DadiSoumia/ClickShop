import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiBox, FiShoppingBag, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/useAuth.js";

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? "bg-primary text-white" : "text-ink hover:bg-surface"
    }`;

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="font-display text-xl font-bold text-ink">
          ClickShop<span className="text-primary">.</span> Admin
        </Link>
        {admin && <p className="text-xs text-ink/50 mt-1">{admin.name}</p>}
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        <NavLink to="/admin/produits" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiBox size={18} /> Produits
        </NavLink>
        <NavLink to="/admin/commandes" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiShoppingBag size={18} /> Commandes
        </NavLink>
          <NavLink to="/admin/categories" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiBox size={18} /> Catégories
        </NavLink>
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink hover:bg-surface w-full transition-colors"
        >
          <FiLogOut size={18} /> Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
    
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-white flex-col">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 max-w-[80vw] bg-white flex flex-col z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
       
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-white">
          <button onClick={() => setSidebarOpen(true)} className="h-9 w-9 flex items-center justify-center" aria-label="Menu">
            <FiMenu size={20} />
          </button>
          <span className="font-display font-bold text-ink text-sm">ClickShop Admin</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}