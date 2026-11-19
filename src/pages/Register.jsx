import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import AuthLayout, { FieldError } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import PasswordInput, { StrengthMeter } from '../components/ui/PasswordInput';

export default function Register() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || '/dashboard';
  const [confirmEmail, setConfirmEmail] = useState(null);
  const { register, handleSubmit, getValues, watch, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => { if (user) navigate(dest, { replace: true }); }, [user, dest, navigate]);

  const onSubmit = async ({ fullName, email, password }) => {
    try {
      const res = await signUp({ fullName, email, password });
      if (res.needsConfirmation) setConfirmEmail(email);
      else { toast.success('Account created — let’s design something beautiful.'); navigate(dest, { replace: true }); }
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (confirmEmail) {
    return (
      <AuthLayout title="Check your inbox" subtitle={`We sent a confirmation link to ${confirmEmail}.`}>
        <div className="card flex items-start gap-4 p-5">
          <MailCheck className="mt-0.5 shrink-0 text-brand" />
          <p className="text-sm text-ink-soft">Click the link in that email to activate your account, then <Link to="/login" className="font-medium text-brand hover:underline">log in</Link>.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account" subtitle="Start designing digital invitations — free."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-medium text-brand hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input id="fullName" autoComplete="name" className="input" placeholder="Michael"
            {...register('fullName', { required: 'Tell us your name.', minLength: { value: 2, message: 'Name is too short.' } })} />
          <FieldError error={errors.fullName} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" inputMode="email" autoComplete="email" className="input" placeholder="you@email.com"
            {...register('email', { required: 'Enter your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email does not look right.' } })} />
          <FieldError error={errors.email} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <PasswordInput id="password" autoComplete="new-password" placeholder="At least 8 characters"
            {...register('password', { required: 'Choose a password.', minLength: { value: 8, message: 'Use at least 8 characters.' } })} />
          <StrengthMeter value={watch('password')} />
          <FieldError error={errors.password} />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <PasswordInput id="confirm" autoComplete="new-password"
            {...register('confirm', { validate: (v) => v === getValues('password') || 'Passwords do not match.' })} />
          <FieldError error={errors.confirm} />
        </div>
        <button className="btn-primary btn-lg w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthLayout>
  );
}
