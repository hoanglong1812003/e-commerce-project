import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatVnd } from "../utils/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag size={48} className="text-ink-300" />
        <h1 className="font-display text-2xl font-semibold text-ink-900">Giỏ hàng trống</h1>
        <p className="text-ink-500">Hãy khám phá sản phẩm và thêm vào giỏ hàng nhé.</p>
        <Link
          to="/products"
          className="rounded-full bg-brand-700 px-6 py-2.5 font-medium text-white hover:bg-brand-800"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display mb-8 text-3xl font-semibold text-ink-900">Giỏ hàng</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ink-900">{item.name}</h3>
                <p className="text-sm text-accent-600">{formatVnd(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-ink-200">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-2 text-ink-600 hover:text-brand-700"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-2 text-ink-600 hover:text-brand-700"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-28 text-right font-semibold text-ink-900">
                {formatVnd(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-ink-400 hover:text-red-600"
                aria-label="Xóa"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between text-sm text-ink-600">
            <span>Tạm tính</span>
            <span>{formatVnd(totalAmount)}</span>
          </div>
          <div className="my-4 border-t border-ink-200" />
          <div className="flex justify-between text-base font-semibold text-ink-900">
            <span>Tổng cộng</span>
            <span className="text-accent-600">{formatVnd(totalAmount)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-brand-700 py-3 text-center font-medium text-white transition hover:bg-brand-800"
          >
            Tiến hành thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}
