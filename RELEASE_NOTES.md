# Release Notes — v0.0.1

**Ngày phát hành:** 10/04/2026
**Tag:** `v0.0.1`
**Nhánh:** `main`

---

## Giới thiệu

Phiên bản đầu tiên của **TodoList Frontend** — ứng dụng quản lý công việc theo giao diện Kanban board lấy cảm hứng từ Trello. Đây là bản khởi động ban đầu (initial release) bao gồm toàn bộ nền tảng UI, xác thực người dùng và quản lý task.

---

## Tính năng ra mắt

### Xác thực người dùng
- Trang **Đăng nhập** với form email/password, thông báo lỗi rõ ràng
- Trang **Đăng ký** tài khoản mới với validation qua Zod schema
- Tự động làm mới access token (JWT refresh token interceptor)
- Trạng thái đăng nhập được lưu bền vững qua localStorage

### Kanban Board
- Giao diện **3 cột**: Cần làm / Đang thực hiện / Hoàn thành
- Tạo task mới từ bất kỳ cột nào qua nút "+"
- Chỉnh sửa task qua modal (tiêu đề, mô tả, mức độ ưu tiên, deadline)
- Xóa task với hộp thoại xác nhận

### Quản lý task
- Hỗ trợ **3 mức độ ưu tiên**: Thấp / Trung bình / Cao
- Hỗ trợ **deadline** cho từng task
- Đồng bộ real-time với backend REST API

### Bảo mật & Điều hướng
- Route `/todos` được bảo vệ, tự động chuyển hướng về `/login` nếu chưa xác thực
- Nút logout trong menu avatar người dùng

---

## Công nghệ sử dụng

| Thư viện | Phiên bản |
|----------|-----------|
| React | 18.3.1 |
| TypeScript | 5.4.5 |
| Vite | 5.2.11 |
| Tailwind CSS | 3.4.3 |
| React Router | 6.23.1 |
| Zustand | 4.5.2 |
| Axios | 1.6.8 |
| React Hook Form | 7.51.4 |
| Zod | 3.23.8 |

---

## Commits trong phiên bản này

| Commit | Mô tả |
|--------|-------|
| `ba6703c` | Initial commit: React + TypeScript + Vite frontend với cấu hình dev/prod |
| `c73c586` | docs: thêm README.md mô tả dự án |
| `b19c589` | chore: cập nhật version lên 0.0.1 |

---

## Hướng dẫn cài đặt

```bash
git clone https://github.com/pnv1002/todolist-frontend.git
cd todolist-frontend
npm install
npm run dev
```

> Xem chi tiết cấu hình môi trường trong [README.md](README.md)

---

## Ghi chú

- Đây là phiên bản **alpha** — chưa dành cho môi trường production
- Cần có backend API đang chạy tại `http://localhost:3001` để ứng dụng hoạt động
- Cấu hình domain production trong `.env.production` trước khi deploy
