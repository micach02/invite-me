import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Camera, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, storage } from '../services';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  useDocumentMeta({ title: 'Profile — InviteMe', description: 'Manage your account', noindex: true });

  const profile = useForm({ defaultValues: { fullName: user.fullName || '', phone: user.phone || '' } });
  const pw = useForm();

  const saveProfile = async (v) => {
    try { await updateProfile({ fullName: v.fullName.trim(), phone: v.phone.trim() }); toast.success('Profile updated'); profile.reset(v); }
    catch (e) { toast.error(e.message); }
  };

  const changePassword = async ({ password }) => {
    try { await auth.updatePassword(password); toast.success('Password changed'); pw.reset(); }
    catch (e) { toast.error(e.message); }
  };

  const pickAvatar = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setUploading(true);
    try {
      const url = await storage.uploadImage(f, user.id);
      await updateProfile({ avatarUrl: url });
      toast.success('Photo updated');
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const logout = async () => { await signOut(); navigate('/'); };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Your profile</h1>
      </div>

      <section className="card p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <button type="button" onClick={() => fileRef.current.click()} className="group relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-brand text-3xl font-semibold text-white" aria-label="Change profile photo">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : (user.fullName || user.email)[0].toUpperCase()}
            <span className="absolute inset-0 grid place-items-center bg-ink/50 opacity-0 transition group-hover:opacity-100">{uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickAvatar} />
          <div><p className="font-display text-lg font-bold">{user.fullName || 'Your name'}</p><p className="text-sm text-ink-soft">{user.email}</p></div>
        </div>

        <form onSubmit={profile.handleSubmit(saveProfile)} className="mt-8 space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="fullName">Full name</label>
            <input id="fullName" className="input" {...profile.register('fullName', { required: 'Enter your name.' })} />
            {profile.formState.errors.fullName && <p className="mt-1 text-xs text-red-600">{profile.formState.errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input bg-canvas" value={user.email} readOnly disabled />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input id="phone" type="tel" className="input" {...profile.register('phone')} />
          </div>
          <button className="btn-primary" disabled={profile.formState.isSubmitting || !profile.formState.isDirty}>Save changes</button>
        </form>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Change password</h2>
        <form onSubmit={pw.handleSubmit(changePassword)} className="mt-5 space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="newpw">New password</label>
            <input id="newpw" type="password" autoComplete="new-password" className="input" {...pw.register('password', { required: 'Choose a password.', minLength: { value: 8, message: 'Use at least 8 characters.' } })} />
            {pw.formState.errors.password && <p className="mt-1 text-xs text-red-600">{pw.formState.errors.password.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="confirmpw">Confirm password</label>
            <input id="confirmpw" type="password" autoComplete="new-password" className="input" {...pw.register('confirm', { validate: (v) => v === pw.getValues('password') || 'Passwords do not match.' })} />
            {pw.formState.errors.confirm && <p className="mt-1 text-xs text-red-600">{pw.formState.errors.confirm.message}</p>}
          </div>
          <button className="btn-secondary" disabled={pw.formState.isSubmitting}>Update password</button>
        </form>
      </section>

      <button className="btn-ghost" onClick={logout}><LogOut size={15} /> Log out</button>
    </div>
  );
}
