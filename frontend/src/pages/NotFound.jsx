import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-semibold text-brand-800">404</p>
      <p className="text-ink-500">Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="rounded-full bg-brand-700 px-6 py-2.5 font-medium text-white hover:bg-brand-800">
        Về trang chủ
      </Link>
    </div>
  );
}
