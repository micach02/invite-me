import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthLayout, { FieldError } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || '/dashboard';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => { if (user) navigate(dest, { replace: true }); }, [user, dest, navigate]);

  const onSubmit = async (v) => {
    try {
      await signIn(v);
      toast.success('Welcome back!');
      navigate(dest, { replace: true });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back" subtitle="Log in to manage your invitations."
      footer={<>New to InviteMe? <Link to="/register" state={location.state} className="font-medium text-brand hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" placeholder="you@email.com"
            {...register('email', { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email does not look right.' } })} />
          <FieldError error={errors.email} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-brand hover:underline">Forgot password?</Link>
          </div>
          <input id="password" type="password" autoComplete="current-password" className="input" placeholder="••••••••"
            {...register('password', { required: 'Enter your password.' })} />
          <FieldError error={errors.password} />
        </div>
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Log in'}</button>
      </form>
    </AuthLayout>
  );
}
