import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display mb-2 text-3xl font-semibold text-ink-900">Đăng nhập</h1>
      <p className="mb-8 text-sm text-ink-500">Chào mừng quay lại Mộc Store.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 outline-none ring-brand-300 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Mật khẩu</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 outline-none ring-brand-300 focus:ring-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-brand-700 py-3 font-medium text-white transition hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-medium text-brand-700 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
