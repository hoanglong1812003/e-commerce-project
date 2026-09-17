import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { getOrder } from "../api/orders";
import { formatVnd, formatDate, STATUS_LABELS, STATUS_STYLES } from "../utils/format";

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentResult = searchParams.get("payment");

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10 text-center text-ink-500">Đang tải...</p>;
  if (!order) return <p className="p-10 text-center text-ink-500">Không tìm thấy đơn hàng.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {paymentResult === "paid" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-brand-100 p-4 text-brand-800">
          <CheckCircle2 size={20} /> Thanh toán thành công! Cảm ơn bạn đã mua hàng.
        </div>
      )}
      {paymentResult === "failed" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-100 p-4 text-red-700">
          <XCircle size={20} /> Thanh toán không thành công. Vui lòng thử lại.
        </div>
      )}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Đơn hàng #{order.id}</h1>
          <p className="text-sm text-ink-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink-700">
                {item.product?.name || `Sản phẩm #${item.productId}`} × {item.quantity}
              </span>
              <span className="font-medium text-ink-900">
                {formatVnd(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="my-6 border-t border-ink-200" />
        <div className="flex justify-between text-lg font-semibold text-ink-900">
          <span>Tổng cộng</span>
          <span className="text-accent-600">{formatVnd(order.totalAmount)}</span>
        </div>
      </div>

      <Link to="/orders" className="mt-6 inline-block text-sm text-brand-700 hover:underline">
        ← Xem tất cả đơn hàng
      </Link>
    </div>
  );
}
