import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate('/todos');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      setError('root', { message: msg });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0052CC 0%, #0079BF 50%, #00AECC 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 select-none">
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
          <rect x="2.5" y="2.5" width="8.5" height="14" rx="1.5" />
          <rect x="13" y="2.5" width="8.5" height="9" rx="1.5" />
        </svg>
        <span className="text-white font-bold text-4xl tracking-tight">Trello</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-8">
        <h1 className="text-center text-[#172B4D] font-semibold text-base mb-6">
          Đăng nhập vào tài khoản của bạn
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {errors.root.message}
            </div>
          )}

          <input
            {...register('email')}
            type="email"
            placeholder="Nhập email"
            className="w-full border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] placeholder-[#8993A4] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
          />
          {errors.email && <p className="text-red-500 text-xs -mt-2">{errors.email.message}</p>}

          <input
            {...register('password')}
            type="password"
            placeholder="Nhập mật khẩu"
            className="w-full border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] placeholder-[#8993A4] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
          />
          {errors.password && <p className="text-red-500 text-xs -mt-2">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0052CC] hover:bg-[#0065FF] text-white font-medium py-2 rounded text-sm transition-colors disabled:opacity-60 mt-1"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DFE1E6]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#8993A4] bg-white px-2">
            hoặc
          </div>
        </div>

        <p className="text-center text-sm text-[#0052CC]">
          <Link to="/register" className="hover:underline font-medium">
            Tạo tài khoản
          </Link>
        </p>
      </div>

      <p className="mt-6 text-white/70 text-xs text-center">
        Bằng cách tiếp tục, bạn đồng ý với{' '}
        <span className="underline cursor-pointer">Điều khoản dịch vụ</span> và{' '}
        <span className="underline cursor-pointer">Chính sách bảo mật</span>
      </p>
    </div>
  );
}
