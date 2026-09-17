import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyOrders } from "../api/orders";
import { formatVnd, formatDate, STATUS_LABELS, STATUS_STYLES } from "../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10 text-center text-ink-500">Đang tải đơn hàng...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display mb-8 text-3xl font-semibold text-ink-900">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <p className="text-ink-500">
          Bạn chưa có đơn hàng nào.{" "}
          <Link to="/products" className="text-brand-700 hover:underline">
            Mua sắm ngay
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-300"
            >
              <div>
                <p className="font-medium text-ink-900">Đơn hàng #{order.id}</p>
                <p className="text-sm text-ink-500">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-ink-500">{order.items.length} sản phẩm</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                <p className="font-semibold text-accent-600">{formatVnd(order.totalAmount)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
