export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-500 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-lg text-brand-800">
            Mộc<span className="text-accent-600">Store</span>
          </p>
          <p>© {new Date().getFullYear()} Mộc Store — Dự án demo DevOps, không phải cửa hàng thật.</p>
        </div>
      </div>
    </footer>
  );
}
