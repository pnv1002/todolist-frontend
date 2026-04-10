import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Todo, TodoFormData, TodoStatus } from '../types';
import { useAttachmentStore } from '../store/attachmentStore';

const schema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().optional().nullable(),
  amount: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().min(0).nullable().optional()
  ),
});

interface Props {
  todo?: Todo | null;
  defaultStatus?: TodoStatus;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => Promise<void>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TodoModal({ todo, defaultStatus = 'pending', onClose, onSubmit }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { attachments, fetchAttachments, uploadAttachment, deleteAttachment } = useAttachmentStore();
  const todoAttachments = todo ? (attachments[todo.id] ?? []) : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      deadline: '',
      amount: null,
    },
  });

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        deadline: todo.deadline ? todo.deadline.slice(0, 10) : '',
        amount: todo.amount ?? null,
      });
      fetchAttachments(todo.id);
    } else {
      reset({ title: '', description: '', status: defaultStatus, priority: 'medium', deadline: '', amount: null });
    }
  }, [todo, defaultStatus, reset, fetchAttachments]);

  const handleFormSubmit = async (data: TodoFormData) => {
    await onSubmit({ ...data, deadline: data.deadline || null });
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !todo) return;
    await uploadAttachment(todo.id, file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.54)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#F4F5F7] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#6B778C] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-[#172B4D] font-semibold text-base">
              {todo ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B778C] hover:text-[#172B4D] hover:bg-[#DFE1E6] rounded p-1 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto px-5 pb-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
              Tiêu đề
            </label>
            <input
              {...register('title')}
              autoFocus
              className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] placeholder-[#8993A4] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm"
              placeholder="Nhập tiêu đề thẻ..."
            />
            {errors.title && (
              <p className="text-[#EB5A46] text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] placeholder-[#8993A4] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm resize-none"
              placeholder="Thêm mô tả chi tiết hơn..."
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
                Trạng thái
              </label>
              <select
                {...register('status')}
                className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm"
              >
                <option value="pending">Cần làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="done">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
                Độ ưu tiên
              </label>
              <select
                {...register('priority')}
                className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>

          {/* Deadline + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
                Ngày hạn
              </label>
              <input
                type="date"
                {...register('deadline')}
                className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide mb-1.5">
                Số tiền
              </label>
              <input
                type="number"
                min="0"
                step="any"
                {...register('amount')}
                className="w-full bg-white border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] placeholder-[#8993A4] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 shadow-sm"
                placeholder="0"
              />
              {errors.amount && (
                <p className="text-[#EB5A46] text-xs mt-1">{errors.amount.message as string}</p>
              )}
            </div>
          </div>

          {/* Attachments — only for existing todos */}
          {todo && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#6B778C] uppercase tracking-wide">
                  Tệp đính kèm
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#0052CC] hover:underline font-medium"
                >
                  + Tải lên
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {todoAttachments.length === 0 ? (
                <p className="text-xs text-[#8993A4] italic">Chưa có tệp đính kèm</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {todoAttachments.map((att) => (
                    <li
                      key={att.id}
                      className="flex items-center justify-between bg-white border border-[#DFE1E6] rounded px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-[#6B778C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs text-[#172B4D] truncate">{att.original_name}</span>
                        <span className="text-xs text-[#8993A4] shrink-0">{formatBytes(att.size_bytes)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteAttachment(todo.id, att.id)}
                        className="text-[#6B778C] hover:text-[#EB5A46] ml-2 shrink-0 transition-colors"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0052CC] hover:bg-[#0065FF] text-white text-sm font-medium px-4 py-2 rounded transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Đang lưu...' : todo ? 'Lưu thay đổi' : 'Thêm thẻ'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#172B4D] text-sm font-medium px-4 py-2 rounded hover:bg-[#DFE1E6] transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
