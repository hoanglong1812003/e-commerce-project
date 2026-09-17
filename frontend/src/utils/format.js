export function formatVnd(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(amount) || 0
  );
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export const STATUS_LABELS = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  SHIPPED: "Đang giao hàng",
  CANCELLED: "Đã hủy",
};

export const STATUS_STYLES = {
  PENDING: "bg-accent-300/40 text-accent-700",
  PAID: "bg-brand-100 text-brand-700",
  FAILED: "bg-red-100 text-red-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-ink-200 text-ink-600",
};
