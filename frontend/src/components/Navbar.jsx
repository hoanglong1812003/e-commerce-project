import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-brand-700" : "text-ink-600 hover:text-brand-700"
  }`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-2xl font-semibold text-brand-800">
          Mộc<span className="text-accent-600">Store</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Đơn hàng của tôi
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1">
                <LayoutDashboard size={16} /> Quản trị
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-ink-700 transition hover:bg-ink-100"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-ink-600 sm:inline">Xin chào, {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-full bg-brand-700 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              <User size={16} /> Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
