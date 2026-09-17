import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
    isActive ? "bg-brand-700 text-white" : "text-ink-600 hover:bg-ink-100"
  }`;

export default function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 sm:px-6">
      <aside className="w-56 shrink-0">
        <h2 className="font-display mb-4 px-2 text-lg font-semibold text-ink-900">Quản trị</h2>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18} /> Tổng quan
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            <Package size={18} /> Sản phẩm
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <ClipboardList size={18} /> Đơn hàng
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
