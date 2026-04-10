import { create } from 'zustand';
import { Attachment } from '../types';
import api from '../services/api';

interface AttachmentState {
  attachments: Record<string, Attachment[]>;
  loading: boolean;
  fetchAttachments: (todoId: string) => Promise<void>;
  uploadAttachment: (todoId: string, file: File) => Promise<void>;
  deleteAttachment: (todoId: string, attachmentId: string) => Promise<void>;
}

export const useAttachmentStore = create<AttachmentState>((set) => ({
  attachments: {},
  loading: false,

  fetchAttachments: async (todoId) => {
    set({ loading: true });
    const { data } = await api.get<Attachment[]>(`/todos/${todoId}/attachments`);
    set((s) => ({ attachments: { ...s.attachments, [todoId]: data }, loading: false }));
  },

  uploadAttachment: async (todoId, file) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post<Attachment>(`/todos/${todoId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    set((s) => ({
      attachments: {
        ...s.attachments,
        [todoId]: [...(s.attachments[todoId] ?? []), data],
      },
    }));
  },

  deleteAttachment: async (todoId, attachmentId) => {
    await api.delete(`/todos/${todoId}/attachments/${attachmentId}`);
    set((s) => ({
      attachments: {
        ...s.attachments,
        [todoId]: (s.attachments[todoId] ?? []).filter((a) => a.id !== attachmentId),
      },
    }));
  },
}));
