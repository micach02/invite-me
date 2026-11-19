import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import AuthLayout, { FieldError } from '../components/layout/AuthLayout';
import { auth, isDemoMode } from '../services';

export default function ForgotPassword() {
  const [sent, setSent] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await auth.requestPasswordReset(email);
      setSent({ email, demoToken: res.demoToken });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?" subtitle="Enter your email and we will send a reset link."
      footer={<Link to="/login" className="font-medium text-brand hover:underline">← Back to log in</Link>}
    >
      {sent ? (
        <div className="card space-y-3 p-5">
          <div className="flex items-start gap-4">
            <MailCheck className="mt-0.5 shrink-0 text-brand" />
            <p className="text-sm text-ink-soft">If an account exists for <b className="text-ink">{sent.email}</b>, a reset link is on its way.</p>
          </div>
          {isDemoMode && sent.demoToken && (
            <Link to={`/reset-password?token=${sent.demoToken}`} className="btn-secondary w-full">Demo mode: open reset link</Link>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@email.com"
              {...register('email', { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email does not look right.' } })} />
            <FieldError error={errors.email} />
          </div>
          <button className="btn-primary btn-lg w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
    </AuthLayout>
  );
}
