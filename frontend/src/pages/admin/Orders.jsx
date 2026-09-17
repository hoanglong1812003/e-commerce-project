import { useEffect, useState } from "react";
import { listAllOrders, updateOrderStatus } from "../../api/orders";
import { formatVnd, formatDate, STATUS_LABELS, STATUS_STYLES } from "../../utils/format";

const STATUSES = ["PENDING", "PAID", "FAILED", "SHIPPED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await updateOrderStatus(id, status);
  }

  if (loading) return <p className="text-ink-500">Đang tải...</p>;

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold text-ink-900">Đơn hàng</h1>

      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-ink-500">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">#{o.id}</td>
                <td className="px-4 py-3">
                  <p className="text-ink-900">{o.user?.name}</p>
                  <p className="text-xs text-ink-500">{o.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-600">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-right font-medium text-ink-900">
                  {formatVnd(o.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${STATUS_STYLES[o.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
