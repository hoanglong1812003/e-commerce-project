# Mộc Store — E-commerce demo & DevOps pipeline

Website thương mại điện tử đơn giản (đăng ký/đăng nhập, phân quyền khách hàng/admin, quản lý sản phẩm,
thanh toán VNPay sandbox) dùng làm dự án học tập vận hành DevOps: container hóa với Docker, triển khai
trên Kubernetes (Docker Desktop), quản lý GitOps bằng ArgoCD, CI/CD với GitHub Actions, image lưu trên
Docker Hub.

## Kiến trúc

```
backend/    Node.js + Express + Prisma + PostgreSQL — REST API, JWT auth, RBAC, VNPay sandbox
frontend/   React + Vite + Tailwind CSS — giao diện khách hàng & trang quản trị
k8s/        Kubernetes manifests (Deployment, Service, Ingress, PVC, Secret...)
argocd/     ArgoCD Application — GitOps
.github/    GitHub Actions CI/CD pipeline
```

## Chạy local (development)

Yêu cầu: Node.js 20+, Docker Desktop.

```bash
# 1. Khởi động PostgreSQL
docker run -d --name ecommerce-postgres \
  -e POSTGRES_USER=ecommerce -e POSTGRES_PASSWORD=ecommerce -e POSTGRES_DB=ecommerce \
  -p 5432:5432 postgres:16-alpine

# 2. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run seed        # tạo tài khoản admin@example.com / Admin@123 + sản phẩm mẫu
npm run dev          # http://localhost:4000

# 3. Frontend (terminal khác)
cd frontend
npm install
npm run dev           # http://localhost:5173
```

Frontend dev server proxy `/api` và `/uploads` sang `http://localhost:4000` (xem `frontend/vite.config.js`).

## Tài khoản mẫu

| Vai trò  | Email               | Mật khẩu   |
|----------|---------------------|------------|
| Admin    | admin@example.com   | Admin@123  |
| Khách hàng | tự đăng ký tại `/register` | — |

## Thanh toán VNPay sandbox

Cần tự đăng ký tài khoản sandbox miễn phí tại https://sandbox.vnpayment.vn để lấy `vnp_TmnCode` và
`vnp_HashSecret`, điền vào `backend/.env`. Không có 2 giá trị này, hệ thống vẫn tạo được đơn hàng nhưng
bước chuyển sang cổng thanh toán sẽ báo lỗi chữ ký từ phía VNPay.

## Roadmap vận hành

- [x] Backend + Frontend chạy ổn định local
- [ ] Container hóa (Docker)
- [ ] Triển khai Kubernetes (Docker Desktop)
- [ ] ArgoCD GitOps
- [ ] CI/CD GitHub Actions → Docker Hub
- [ ] Tài liệu Word tổng kết kiến trúc & vận hành
