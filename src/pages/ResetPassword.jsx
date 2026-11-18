import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthLayout, { FieldError } from '../components/layout/AuthLayout';
import { PageLoader } from '../components/ui/misc';
import { auth, isDemoMode } from '../services';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm();

  // Supabase recovery links sign the user in temporarily; demo mode uses a token.
  const allowed = isDemoMode ? Boolean(token) : Boolean(user);

  const onSubmit = async ({ password }) => {
    try {
      await auth.updatePassword(password, token);
      toast.success('Password updated.');
      navigate(isDemoMode ? '/login' : '/dashboard', { replace: true });
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you have not used before.">
      {!allowed ? (
        <div className="card p-5 text-sm text-ink-soft">
          This reset link is missing or has expired. <Link to="/forgot-password" className="font-medium text-brand hover:underline">Request a new one</Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="password">New password</label>
            <input id="password" type="password" autoComplete="new-password" className="input"
              {...register('password', { required: 'Choose a password.', minLength: { value: 8, message: 'Use at least 8 characters.' } })} />
            <FieldError error={errors.password} />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" autoComplete="new-password" className="input"
              {...register('confirm', { validate: (v) => v === getValues('password') || 'Passwords do not match.' })} />
            <FieldError error={errors.confirm} />
          </div>
          <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Update password'}</button>
        </form>
      )}
    </AuthLayout>
  );
}
