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

## 1. Chạy local (development, không cần Docker)

Yêu cầu: Node.js 20+, Docker Desktop (chỉ để chạy PostgreSQL).

```bash
# PostgreSQL
docker run -d --name ecommerce-postgres \
  -e POSTGRES_USER=ecommerce -e POSTGRES_PASSWORD=ecommerce -e POSTGRES_DB=ecommerce \
  -p 5432:5432 postgres:16-alpine

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run seed        # tạo tài khoản admin@example.com / Admin@123 + sản phẩm mẫu
npm run dev          # http://localhost:4000

# Frontend (terminal khác)
cd frontend
npm install
npm run dev           # http://localhost:5173
```

Frontend dev server proxy `/api` và `/uploads` sang `http://localhost:4000` (xem `frontend/vite.config.js`).

## 2. Chạy bằng Docker Compose (toàn bộ container hóa)

```bash
docker compose up -d --build
docker compose exec backend npm run seed
```

Mở http://localhost:8080. Nginx trong container frontend tự proxy `/api` và `/uploads` sang backend.

## 3. Triển khai lên Kubernetes (Docker Desktop)

```bash
# 1. Bật Kubernetes: Docker Desktop → Settings → Kubernetes → Enable Kubernetes
kubectl config use-context docker-desktop

# 2. Cài ingress-nginx (một lần)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.3/deploy/static/provider/cloud/deploy.yaml

# 3. Build & gắn tag image local (nếu chưa dùng image từ Docker Hub)
docker build -t longshen4444/e-commerce:backend-latest ./backend
docker build -t longshen4444/e-commerce:frontend-latest ./frontend

# 4. Deploy
kubectl apply -k k8s/
kubectl exec -n ecommerce deploy/backend -- npm run seed

# 5. Truy cập qua Ingress — thêm dòng sau vào hosts file (quyền admin):
#    127.0.0.1  e-commerce.local
# rồi mở http://e-commerce.local
```

Kiểm tra trạng thái: `kubectl get pods,svc,ingress -n ecommerce`

## 4. GitOps với ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.13.2/manifests/install.yaml
kubectl apply -f argocd/application.yaml

# Lấy mật khẩu admin ban đầu
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Mở UI
kubectl port-forward svc/argocd-server -n argocd 8081:443
# https://localhost:8081  (user: admin)
```

Từ đây, mọi thay đổi trong thư mục `k8s/` được push lên nhánh `main` sẽ được ArgoCD tự động phát hiện
và đồng bộ vào cluster (`automated.prune + selfHeal` đã bật trong `argocd/application.yaml`).

## 5. CI/CD — GitHub Actions → Docker Hub → ArgoCD

`.github/workflows/ci-cd.yaml` chạy khi push lên `main` (trừ khi chỉ sửa `k8s/**` hoặc `*.md`):

1. Build image backend & frontend, push lên Docker Hub với tag `backend-<sha>` / `frontend-<sha>` (+ `latest`)
2. Cập nhật tag image trong `k8s/backend-deployment.yaml` và `k8s/frontend-deployment.yaml`
3. Commit & push thay đổi manifest trở lại `main`
4. ArgoCD phát hiện commit mới → tự động đồng bộ → rollout bản deploy mới

Cần thêm 2 secret trong **Settings → Secrets and variables → Actions** của repo GitHub:

| Secret               | Giá trị                                  |
|----------------------|-------------------------------------------|
| `DOCKERHUB_USERNAME` | `longshen4444`                            |
| `DOCKERHUB_TOKEN`    | Access token tạo tại hub.docker.com → Account Settings → Security |

## Tài khoản mẫu

| Vai trò  | Email               | Mật khẩu   |
|----------|---------------------|------------|
| Admin    | admin@example.com   | Admin@123  |
| Khách hàng | tự đăng ký tại `/register` | — |

## Thanh toán VNPay sandbox

Cần tự đăng ký tài khoản sandbox miễn phí tại https://sandbox.vnpayment.vn để lấy `vnp_TmnCode` và
`vnp_HashSecret`, điền vào `backend/.env` (local) hoặc `k8s/backend-secret.yaml` (Kubernetes). Không có
2 giá trị này, hệ thống vẫn tạo được đơn hàng nhưng bước chuyển sang cổng thanh toán sẽ báo lỗi chữ ký
từ phía VNPay.

## Roadmap vận hành

- [x] Backend + Frontend chạy ổn định local
- [x] Container hóa (Docker + Docker Compose)
- [x] Triển khai Kubernetes (Docker Desktop)
- [x] ArgoCD GitOps (auto-sync + self-heal đã kiểm chứng)
- [x] CI/CD GitHub Actions → Docker Hub
- [ ] Tài liệu Word tổng kết kiến trúc & vận hành
