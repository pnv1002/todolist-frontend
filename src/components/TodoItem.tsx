import { Todo } from '../types';

const priorityLabel: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: '#61BD4F', text: 'white', label: 'Thấp' },
  medium: { bg: '#F2D600', text: '#172B4D', label: 'Trung bình' },
  high:   { bg: '#EB5A46', text: 'white', label: 'Cao' },
};

interface Props {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onEdit, onDelete }: Props) {
  const p = priorityLabel[todo.priority];
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && todo.status !== 'done';

  return (
    <div
      className="bg-white rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
      onClick={() => onEdit(todo)}
    >
      {/* Priority label stripe */}
      <div
        className="h-2 rounded-t"
        style={{ backgroundColor: p.bg }}
      />

      <div className="px-3 pt-2 pb-3">
        {/* Priority badge */}
        <div className="flex gap-1 mb-2 flex-wrap">
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: p.bg, color: p.text }}
          >
            {p.label}
          </span>
          {todo.status === 'done' && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-[#61BD4F] text-white">
              Hoàn thành
            </span>
          )}
          {todo.status === 'in_progress' && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-[#0079BF] text-white">
              Đang làm
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm text-[#172B4D] leading-snug mb-2 font-medium">{todo.title}</p>

        {/* Description */}
        {todo.description && (
          <p className="text-xs text-[#6B778C] line-clamp-2 mb-2">{todo.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {todo.deadline && (
              <span
                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${
                  isOverdue
                    ? 'bg-[#EB5A46] text-white'
                    : todo.status === 'done'
                    ? 'bg-[#61BD4F] text-white'
                    : 'bg-[#F4F5F7] text-[#6B778C]'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(todo.deadline).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>

          {/* Actions (visible on hover) */}
          <div
            className="hidden group-hover:flex gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(todo)}
              className="text-[#6B778C] hover:text-[#172B4D] p-1 rounded hover:bg-[#EBECF0] transition-colors"
              title="Chỉnh sửa"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-[#6B778C] hover:text-[#EB5A46] p-1 rounded hover:bg-[#EBECF0] transition-colors"
              title="Xóa"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
