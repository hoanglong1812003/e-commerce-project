import { useEffect, useState } from "react";
import { Package, ClipboardList, Wallet, Clock } from "lucide-react";
import { listAllOrders } from "../../api/orders";
import { listProducts } from "../../api/products";
import { formatVnd } from "../../utils/format";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listAllOrders(), listProducts()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink-500">Đang tải...</p>;

  const revenue = orders
    .filter((o) => o.status === "PAID" || o.status === "SHIPPED")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;

  const stats = [
    { icon: Wallet, label: "Doanh thu", value: formatVnd(revenue), color: "text-brand-600" },
    { icon: ClipboardList, label: "Tổng đơn hàng", value: orders.length, color: "text-accent-600" },
    { icon: Clock, label: "Chờ thanh toán", value: pending, color: "text-amber-600" },
    { icon: Package, label: "Sản phẩm", value: products.length, color: "text-blue-600" },
  ];

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold text-ink-900">Tổng quan</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink-200 bg-white p-5">
            <s.icon className={`mb-3 ${s.color}`} size={24} />
            <p className="text-2xl font-semibold text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display mb-4 mt-10 text-lg font-semibold text-ink-900">
        Đơn hàng gần đây
      </h2>
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-ink-500">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">#{o.id}</td>
                <td className="px-4 py-3 text-ink-600">{o.user?.name}</td>
                <td className="px-4 py-3 text-ink-600">{o.status}</td>
                <td className="px-4 py-3 text-right font-medium text-ink-900">
                  {formatVnd(o.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
