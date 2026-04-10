# Release Notes — v0.0.2

**Ngày phát hành:** 10/04/2026
**Tag:** `v0.0.2`
**Nhánh:** `main`
**Phiên bản trước:** `v0.0.1`

---

## Tổng quan

Phiên bản `v0.0.2` tập trung vào trải nghiệm tương tác của bảng Kanban và mở rộng kết nối với toàn bộ API backend. Người dùng giờ có thể kéo thả thẻ bằng chuột giữa các cột, đính kèm file vào task, và nhập thêm trường số tiền.

---

## Tính năng mới

### Kéo thả Kanban (Drag & Drop)
- Kéo thẻ bằng chuột sang bất kỳ cột nào (Cần làm / Đang thực hiện / Hoàn thành)
- Cột đang hover sáng lên để xác nhận vị trí thả
- Thẻ đang kéo hiển thị dưới dạng ghost card hơi nghiêng theo chuột
- Click bình thường vẫn mở modal chỉnh sửa (không kích hoạt drag)
- Sau khi thả, gọi API `PATCH /todos/:id/move` để lưu trạng thái mới

### Tệp đính kèm (Attachments)
- Tải lên file đính kèm cho từng task qua nút **"+ Tải lên"** trong modal chỉnh sửa
- Xem danh sách tất cả file đính kèm với tên file và dung lượng
- Xóa từng file đính kèm trực tiếp trong modal
- Kết nối đầy đủ với API `GET / POST / DELETE /todos/:id/attachments`

### Trường Số tiền (Amount)
- Thêm field **Số tiền** vào form tạo/chỉnh sửa task
- Hỗ trợ giá trị thập phân, không bắt buộc nhập

---

## Cải tiến kỹ thuật

- Thêm `attachmentStore` (Zustand) quản lý trạng thái file đính kèm theo từng todo
- Cập nhật `todoStore`: thêm action `moveTodo`
- Cập nhật kiểu dữ liệu `Todo`: bổ sung `position`, `amount`
- Cập nhật `TodoFormData`: bổ sung `amount`
- Thêm interface `Attachment`

---

## Thư viện mới

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| @dnd-kit/core | 6.3.1 | Drag & drop cho Kanban board |

---

## Commits trong phiên bản này

| Commit | Mô tả |
|--------|-------|
| `54a3d96` | docs: thêm release notes cho v0.0.1 |
| `3e6ed7e` | feat: drag-and-drop Kanban, attachment support, amount field |

---

## Ghi chú

- Tính năng attachment chỉ hiển thị khi **chỉnh sửa** task đã tồn tại (không có khi tạo mới)
- File tải lên được lưu trong thư mục `uploads/` phía backend

---

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
