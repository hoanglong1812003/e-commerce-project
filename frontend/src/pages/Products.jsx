import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["Tất cả", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCategory = category === "Tất cả" || p.category === category;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [products, category, search]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display mb-6 text-3xl font-semibold text-ink-900">Tất cả sản phẩm</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-full border border-ink-200 bg-white py-2 pl-10 pr-4 text-sm outline-none ring-brand-300 focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "bg-brand-700 text-white"
                  : "bg-white text-ink-600 border border-ink-200 hover:border-brand-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-ink-500">Đang tải sản phẩm...</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
