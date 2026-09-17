import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { listProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

const perks = [
  { icon: Truck, title: "Giao hàng nhanh", desc: "Giao trong 24-48h nội thành" },
  { icon: ShieldCheck, title: "Thanh toán an toàn", desc: "Tích hợp cổng VNPay sandbox" },
  { icon: RefreshCw, title: "Đổi trả dễ dàng", desc: "Đổi trả trong 7 ngày" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts()
      .then((data) => setProducts(data.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(82,176,136,0.35),_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:py-28">
          <span className="rounded-full bg-brand-800/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-200">
            Bộ sưu tập mới
          </span>
          <h1 className="font-display max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Những món đồ chất lượng cho cuộc sống mỗi ngày
          </h1>
          <p className="max-w-lg text-brand-100">
            Mộc Store tuyển chọn sản phẩm thời trang, điện tử và gia dụng — thanh toán nhanh chóng
            qua VNPay, vận hành trên hạ tầng Kubernetes hiện đại.
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-medium text-brand-950 transition hover:bg-accent-400"
          >
            Khám phá sản phẩm <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {perks.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-5"
            >
              <p.icon className="mt-0.5 shrink-0 text-brand-600" size={24} />
              <div>
                <h3 className="font-semibold text-ink-900">{p.title}</h3>
                <p className="text-sm text-ink-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-sm font-medium text-brand-700 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <p className="text-ink-500">Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p className="text-ink-500">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
