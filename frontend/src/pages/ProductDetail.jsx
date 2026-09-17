import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import { formatVnd } from "../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .catch(() => setError("Không tìm thấy sản phẩm."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10 text-center text-ink-500">Đang tải...</p>;
  if (error || !product)
    return <p className="p-10 text-center text-ink-500">{error || "Không tìm thấy sản phẩm."}</p>;

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-ink-100">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-ink-400">
              Không có ảnh
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-accent-600">{formatVnd(product.price)}</p>
          <p className="leading-relaxed text-ink-600">{product.description}</p>

          <p className="text-sm text-ink-500">
            {outOfStock ? (
              <span className="font-medium text-red-600">Hết hàng</span>
            ) : (
              `Còn ${product.stock} sản phẩm trong kho`
            )}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-ink-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-ink-600 hover:text-brand-700"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2.5 text-ink-600 hover:text-brand-700"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-medium text-white transition hover:bg-brand-800"
              >
                <ShoppingCart size={18} /> {added ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
              </button>
            </div>
          )}

          <Link to="/cart" className="text-sm text-brand-700 hover:underline">
            Xem giỏ hàng →
          </Link>
        </div>
      </div>
    </div>
  );
}
