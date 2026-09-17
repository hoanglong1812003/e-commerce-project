import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orders";
import { createVnpayPaymentUrl } from "../api/payments";
import { formatVnd } from "../utils/format";

export default function Checkout() {
  const { items, totalAmount, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-ink-500">Giỏ hàng trống, không có gì để thanh toán.</p>
        <Link to="/products" className="mt-4 inline-block text-brand-700 hover:underline">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      const order = await createOrder(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      const { paymentUrl } = await createVnpayPaymentUrl(order.id);
      clear();
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display mb-8 text-3xl font-semibold text-ink-900">Thanh toán</h1>

      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-ink-900">Thông tin khách hàng</h2>
        <p className="text-sm text-ink-600">{user?.name}</p>
        <p className="text-sm text-ink-500">{user?.email}</p>

        <div className="my-6 border-t border-ink-200" />

        <h2 className="mb-4 font-medium text-ink-900">Đơn hàng ({items.length} sản phẩm)</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-ink-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-ink-900">{formatVnd(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-ink-200" />

        <div className="flex justify-between text-lg font-semibold text-ink-900">
          <span>Tổng thanh toán</span>
          <span className="text-accent-600">{formatVnd(totalAmount)}</span>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-brand-700 py-3 font-medium text-white transition hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Đang chuyển tới VNPay..." : "Thanh toán qua VNPay"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-400">
          Bạn sẽ được chuyển tới cổng thanh toán VNPay (môi trường sandbox) để hoàn tất giao dịch.
        </p>
      </div>
    </div>
  );
}
