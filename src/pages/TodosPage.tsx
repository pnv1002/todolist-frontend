import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodoStore } from '../store/todoStore';
import { useAuthStore } from '../store/authStore';
import { Todo, TodoFormData, TodoStatus } from '../types';
import TodoItem from '../components/TodoItem';
import TodoModal from '../components/TodoModal';
import api from '../services/api';

const COLUMNS: { key: TodoStatus; label: string }[] = [
  { key: 'pending',     label: 'Cần làm' },
  { key: 'in_progress', label: 'Đang thực hiện' },
  { key: 'done',        label: 'Hoàn thành' },
];

export default function TodosPage() {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuthStore();
  const { todos, loading, fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TodoStatus>('pending');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout', { refreshToken }); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const handleSubmit = async (data: TodoFormData) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, data);
    } else {
      await createTodo(data);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Xóa thẻ này?')) await deleteTodo(id);
  };

  const openCreate = (status: TodoStatus) => {
    setDefaultStatus(status);
    setEditingTodo(null);
    setModalOpen(true);
  };

  const byStatus = (status: TodoStatus) => todos.filter((t) => t.status === status);

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0079BF' }}>
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-4 h-12 shrink-0"
        style={{ background: 'rgba(0,0,0,0.32)' }}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <button className="text-white/80 hover:text-white hover:bg-white/20 rounded px-2 py-1 text-sm transition-colors">
            <svg className="w-4 h-4 inline -mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 000 2h14a1 1 0 000-2H3zM3 9a1 1 0 000 2h14a1 1 0 000-2H3zM3 14a1 1 0 000 2h14a1 1 0 000-2H3z"/>
            </svg>
            Menu
          </button>
        </div>

        {/* Center — Logo */}
        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 select-none cursor-pointer">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <rect x="2.5" y="2.5" width="8.5" height="14" rx="1.5" />
            <rect x="13" y="2.5" width="8.5" height="9" rx="1.5" />
          </svg>
          <span className="text-white font-bold text-xl tracking-tight">Trello</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-full bg-[#0052CC] text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-white/50 transition-all"
            title={user?.name}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 bg-white rounded-lg shadow-xl border border-[#DFE1E6] w-56 z-50 py-1">
              <div className="px-4 py-3 border-b border-[#DFE1E6]">
                <p className="font-semibold text-[#172B4D] text-sm">{user?.name}</p>
                <p className="text-[#6B778C] text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-[#172B4D] hover:bg-[#F4F5F7] transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Board title ── */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h1 className="text-white font-bold text-lg">Bảng công việc của tôi</h1>
      </div>

      {/* ── Kanban Board ── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/70 text-sm">Đang tải...</div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 px-4 pb-4 h-full items-start">
            {COLUMNS.map((col) => {
              const cards = byStatus(col.key);
              return (
                <div
                  key={col.key}
                  className="flex flex-col rounded-xl shrink-0 w-[272px]"
                  style={{ background: '#EBECF0', maxHeight: 'calc(100vh - 130px)' }}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <h2 className="text-[#172B4D] font-semibold text-sm">
                      {col.label}
                      <span className="ml-2 text-[#6B778C] font-normal">{cards.length}</span>
                    </h2>
                    <button
                      onClick={() => openCreate(col.key)}
                      className="text-[#6B778C] hover:text-[#172B4D] hover:bg-[#DFE1E6] rounded p-0.5 transition-colors"
                      title="Thêm thẻ"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Cards list */}
                  <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2">
                    {cards.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>

                  {/* Add card button */}
                  <button
                    onClick={() => openCreate(col.key)}
                    className="flex items-center gap-1.5 mx-2 mb-2 px-3 py-2 rounded text-[#6B778C] hover:bg-[#DFE1E6] hover:text-[#172B4D] text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm thẻ
                  </button>
                </div>
              );
            })}

            {/* Add column placeholder */}
            <button className="shrink-0 w-[272px] h-10 rounded-xl flex items-center gap-2 px-3 text-white/80 hover:text-white hover:bg-white/20 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm danh sách khác
            </button>
          </div>
        </div>
      )}

      {/* Overlay khi menu mở */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* Modal */}
      {modalOpen && (
        <TodoModal
          todo={editingTodo}
          defaultStatus={defaultStatus}
          onClose={() => { setModalOpen(false); setEditingTodo(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
