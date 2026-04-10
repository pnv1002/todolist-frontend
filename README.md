# TodoList Frontend

Ứng dụng quản lý công việc theo phong cách Kanban board, lấy cảm hứng từ Trello. Được xây dựng bằng React + TypeScript + Vite.

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.4.5 | Type safety |
| Vite | 5.2.11 | Build tool & dev server |
| Tailwind CSS | 3.4.3 | Styling |
| React Router | 6.23.1 | Routing |
| Zustand | 4.5.2 | State management |
| Axios | 1.6.8 | HTTP client |
| React Hook Form | 7.51.4 | Form handling |
| Zod | 3.23.8 | Schema validation |

## Tính năng

- **Xác thực người dùng**: Đăng nhập / Đăng ký với JWT (access token + refresh token tự động)
- **Kanban Board**: 3 cột — Cần làm / Đang thực hiện / Hoàn thành
- **Quản lý todo**: Tạo, chỉnh sửa, xóa task với tiêu đề, mô tả, mức độ ưu tiên, deadline
- **Protected Routes**: Trang Kanban chỉ truy cập được khi đã đăng nhập
- **Persistent Auth**: Trạng thái đăng nhập được lưu vào localStorage

## Cấu trúc thư mục

```
src/
├── components/
│   ├── ProtectedRoute.tsx   # Route guard cho trang cần đăng nhập
│   ├── TodoItem.tsx         # Card hiển thị từng task
│   └── TodoModal.tsx        # Modal tạo/chỉnh sửa task
├── pages/
│   ├── LoginPage.tsx        # Trang đăng nhập
│   ├── RegisterPage.tsx     # Trang đăng ký
│   └── TodosPage.tsx        # Kanban board chính
├── services/
│   └── api.ts               # Axios instance + JWT interceptor
├── store/
│   ├── authStore.ts         # Zustand store cho auth
│   └── todoStore.ts         # Zustand store cho todos
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx                  # Cấu hình router
└── main.tsx                 # Entry point
```

## Cài đặt & Chạy

### Yêu cầu

- Node.js >= 18
- npm >= 9

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình môi trường

Tạo file `.env.development` (đã có sẵn trong repo):

```env
VITE_API_BASE_URL=/api
```

Vite sẽ tự proxy `/api` → `http://localhost:3001` (xem `vite.config.ts`).

Cho production, cập nhật `.env.production`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Chạy development

```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`

### Build production

```bash
npm run build
npm run preview   # Xem trước bản build
```

## API Endpoints

Ứng dụng kết nối với backend REST API:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/refresh` | Làm mới access token |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/todos` | Lấy danh sách todos |
| POST | `/todos` | Tạo todo mới |
| PUT | `/todos/:id` | Cập nhật todo |
| DELETE | `/todos/:id` | Xóa todo |

## Data Types

```typescript
type TodoStatus   = "pending" | "in_progress" | "done"
type TodoPriority = "low" | "medium" | "high"

interface Todo {
  id: number
  user_id: number
  title: string
  description?: string
  status: TodoStatus
  priority: TodoPriority
  deadline?: string | null
  created_at: string
  updated_at: string
}
```

## Routes

| Path | Trang | Yêu cầu đăng nhập |
|------|-------|-------------------|
| `/login` | Trang đăng nhập | Không |
| `/register` | Trang đăng ký | Không |
| `/todos` | Kanban board | Có |
