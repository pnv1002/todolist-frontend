# Quy trình tổng thể - TodoList Frontend

## 1. Kiến trúc tổng quan

```mermaid
graph TD
    A[Browser] --> B[main.tsx\nReactDOM.createRoot]
    B --> C[App.tsx\nReact Router v6]
    C --> D{Route}
    D --> E[/login → LoginPage]
    D --> F[/register → RegisterPage]
    D --> G[/todos → ProtectedRoute]
    G --> H{Có accessToken?}
    H -- Không --> E
    H -- Có --> I[TodosPage\nKanban Board]
```

---

## 2. Luồng xác thực (Authentication)

```mermaid
sequenceDiagram
    actor User
    participant UI as LoginPage
    participant Store as authStore (Zustand)
    participant LS as localStorage
    participant API as Backend API

    User->>UI: Nhập email + password
    UI->>UI: Validate (Zod Schema)
    UI->>API: POST /auth/login
    API-->>UI: { user, accessToken, refreshToken }
    UI->>Store: setAuth(user, token, refreshToken)
    Store->>LS: Lưu vào auth-storage
    UI->>User: Chuyển hướng → /todos

    Note over Store,API: Khi token hết hạn (401)
    API-->>Store: 401 Unauthorized
    Store->>API: POST /api/auth/refresh
    API-->>Store: accessToken mới
    Store->>Store: setAccessToken(newToken)
    Store->>API: Retry request ban đầu
```

---

## 3. Luồng bảo vệ route (ProtectedRoute)

```mermaid
flowchart LR
    A[Truy cập /todos] --> B{authStore\naccessToken?}
    B -- null --> C[Redirect /login]
    B -- có token --> D[Render TodosPage]
```

---

## 4. Luồng dữ liệu chính (Data Flow)

```mermaid
flowchart TD
    subgraph Components
        TP[TodosPage]
        TI[TodoItem]
        TM[TodoModal]
    end

    subgraph Stores
        AS[authStore]
        TS[todoStore]
        ATS[attachmentStore]
    end

    subgraph API["API Layer (Axios)"]
        AX[api.ts\nAxios Instance]
        INT[Interceptor\nThêm Bearer Token]
    end

    subgraph Backend
        BE[REST API]
    end

    TP -- "useEffect → fetchTodos()" --> TS
    TS --> AX
    AX --> INT
    INT -- "Authorization: Bearer token" --> BE
    BE -- "Todo[]" --> TS
    TS -- "re-render" --> TP

    TM -- "createTodo / updateTodo" --> TS
    TI -- "deleteTodo" --> TS
    TM -- "uploadAttachment" --> ATS
    ATS --> AX
    AS -- "accessToken" --> INT
```

---

## 5. Luồng CRUD Todo

```mermaid
flowchart TD
    A[TodosPage mount] --> B[fetchTodos\nGET /todos]
    B --> C[Hiển thị 3 cột Kanban\npending / in_progress / done]

    C --> D{Hành động}

    D --> E[Tạo mới\nClick nút +]
    E --> F[Mở TodoModal\nform rỗng]
    F --> G[Submit → createTodo\nPOST /todos]
    G --> H[Thêm vào store\ntodos.push]

    D --> I[Chỉnh sửa\nClick Edit]
    I --> J[Mở TodoModal\nform có dữ liệu]
    J --> K[Submit → updateTodo\nPUT /todos/:id]
    K --> L[Cập nhật store\ntodos.map]

    D --> M[Xoá\nClick Delete]
    M --> N[Xác nhận]
    N --> O[deleteTodo\nDELETE /todos/:id]
    O --> P[Xoá khỏi store\ntodos.filter]

    D --> Q[Kéo thả\nDrag & Drop]
    Q --> R[handleDragEnd\nlấy status + position mới]
    R --> S[moveTodo\nPATCH /todos/:id/move]
    S --> T[Cập nhật store\ntodos.map]
```

---

## 6. Luồng Attachment (Đính kèm file)

```mermaid
sequenceDiagram
    participant U as User
    participant TM as TodoModal
    participant ATS as attachmentStore
    participant API as Backend

    U->>TM: Mở modal chỉnh sửa todo
    TM->>ATS: fetchAttachments(todoId)
    ATS->>API: GET /todos/:id/attachments
    API-->>ATS: Attachment[]
    ATS-->>TM: Hiển thị danh sách file

    U->>TM: Chọn file upload
    TM->>ATS: uploadAttachment(todoId, file)
    ATS->>API: POST /todos/:id/attachments (multipart)
    API-->>ATS: Attachment mới
    ATS-->>TM: Cập nhật danh sách

    U->>TM: Xoá attachment
    TM->>ATS: deleteAttachment(todoId, attachmentId)
    ATS->>API: DELETE /todos/:id/attachments/:aid
    API-->>ATS: OK
    ATS-->>TM: Xoá khỏi danh sách
```

---

## 7. Cấu trúc Component

```mermaid
graph TD
    App --> Router[BrowserRouter]
    Router --> Routes
    Routes --> Login[LoginPage]
    Routes --> Register[RegisterPage]
    Routes --> PR[ProtectedRoute]
    PR --> TodosPage

    TodosPage --> Header
    Header --> UserMenu[User Info + Logout]

    TodosPage --> DndContext[DndContext\n@dnd-kit/core]
    DndContext --> Col1[Cột: Pending]
    DndContext --> Col2[Cột: In Progress]
    DndContext --> Col3[Cột: Done]

    Col1 --> TI1[TodoItem x N]
    Col2 --> TI2[TodoItem x N]
    Col3 --> TI3[TodoItem x N]

    TI1 --> Actions1[Edit / Delete buttons]
    DndContext --> Overlay[DragOverlay\nghost card]

    TodosPage --> TM[TodoModal\nCreate / Edit]
    TM --> Form[React Hook Form + Zod]
    TM --> AttachList[Attachment List]
```

---

## 8. State Management (Zustand Stores)

```mermaid
graph LR
    subgraph authStore
        U[user]
        AT[accessToken]
        RT[refreshToken]
        SA[setAuth]
        SAT[setAccessToken]
        LO[logout]
    end

    subgraph todoStore
        Todos[todos: Todo array]
        Loading[loading: boolean]
        FT[fetchTodos]
        CT[createTodo]
        UT[updateTodo]
        MT[moveTodo]
        DT[deleteTodo]
    end

    subgraph attachmentStore
        Atts[attachments: Record]
        FA[fetchAttachments]
        UA[uploadAttachment]
        DA[deleteAttachment]
    end

    LS[(localStorage\nauth-storage)] <--> authStore
    authStore -- "Bearer Token" --> API[(REST API)]
    todoStore <--> API
    attachmentStore <--> API
```

---

## 9. Tóm tắt quy trình end-to-end

```
[User mở app]
      │
      ▼
[main.tsx] → [App.tsx] → [Router kiểm tra route]
      │
      ▼
[ProtectedRoute kiểm tra localStorage]
      │
      ├── Chưa đăng nhập ──→ [LoginPage] ──→ POST /auth/login ──→ Lưu token vào store
      │
      └── Đã đăng nhập ──→ [TodosPage]
                                │
                                ▼
                          [fetchTodos] → GET /todos → Hiển thị Kanban
                                │
                          ┌─────┴──────┐──────────────┐
                          ▼            ▼               ▼
                      [Tạo todo]  [Kéo thả]       [Xoá todo]
                      POST /todos  PATCH /move     DELETE /todos/:id
                          │            │               │
                          └─────┬──────┘───────────────┘
                                ▼
                          [Store cập nhật] → [UI re-render]
```
