import { Link } from "react-router-dom";
import { formatVnd } from "../utils/format";

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-400">Không có ảnh</div>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-2.5 py-1 text-xs font-medium text-white">
            Hết hàng
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="font-display text-lg font-semibold text-ink-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-lg font-semibold text-accent-600">
          {formatVnd(product.price)}
        </p>
      </div>
    </Link>
  );
}
