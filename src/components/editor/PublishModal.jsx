import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Globe } from 'lucide-react';
import Modal from '../ui/Modal';
import { invitations } from '../../services';
import { randomSuffix, siteUrl, slugify } from '../../lib/utils';

/** Choose the public URL (slug), verify it's free, then publish. Also used to change the slug later. */
export default function PublishModal({ open, onClose, invitation, suggestion, onConfirm }) {
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (open) reset({ slug: invitation.slug || suggestion });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const published = invitation.status === 'published';
  const submit = async ({ slug }) => { await onConfirm(slug); };

  return (
    <Modal
      open={open} onClose={onClose} title={published ? 'Change invitation link' : 'Publish invitation'}
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" form="publish-form" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Publishing…' : published ? 'Update link' : 'Publish now'}</button>
      </>}
    >
      <form id="publish-form" onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-ink-soft">
          <Globe size={18} className="mt-0.5 shrink-0 text-brand" />
          <p>{published ? 'Changing the link breaks the old one — update anywhere you have shared it.' : 'Your invitation will be visible to anyone who has the link. You can unpublish at any time.'}</p>
        </div>
        <div>
          <label className="label" htmlFor="slug">Invitation link</label>
          <div className="flex items-stretch overflow-hidden rounded-xl border border-sand focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="flex items-center bg-canvas px-3 text-xs text-ink-mute">{siteUrl().replace(/^https?:\/\//, '')}/invitation/</span>
            <input
              id="slug" autoComplete="off" spellCheck="false" className="w-full bg-white px-3 py-2.5 text-sm outline-none"
              {...register('slug', {
                required: 'Choose a link.',
                minLength: { value: 3, message: 'Use at least 3 characters.' },
                pattern: { value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Use lowercase letters, numbers and single hyphens.' },
                onChange: (e) => setValue('slug', slugify(e.target.value).replace(/-$/, e.target.value.endsWith('-') ? '-' : ''), { shouldValidate: true }),
                validate: async (v) => (await invitations.slugAvailable(v, invitation.id)) || 'That link is already taken.',
              })}
            />
          </div>
          {errors.slug
            ? <p className="mt-1 text-xs text-red-600" role="alert">{errors.slug.message}</p>
            : <p className="mt-1 text-xs text-ink-mute">Example: john-and-jane-wedding</p>}
          <button type="button" className="mt-2 text-xs font-medium text-brand hover:underline" onClick={() => setValue('slug', `${suggestion}-${randomSuffix()}`, { shouldValidate: true })}>Suggest another</button>
        </div>
      </form>
    </Modal>
  );
}
