import { useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { CheckCircle2, Send } from 'lucide-react';

const CHOICES = [
  { value: 'yes', label: 'Joyfully accepts' },
  { value: 'maybe', label: 'Not sure yet' },
  { value: 'no', label: 'Regretfully declines' },
];

/**
 * Guest-facing RSVP form (React Hook Form). `onSubmit` is omitted inside the editor,
 * where the form is fully interactive but nothing is stored.
 */
export default function RsvpForm({ config, onSubmit }) {
  const r = config.sections.rsvp;
  const preview = !onSubmit;
  const [done, setDone] = useState(null);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { attending: 'yes', guestCount: 1, guestName: '', email: '', phone: '', message: '', mealPreference: '' },
  });

  const attending = watch('attending');
  const meals = (r.mealOptions || '').split(',').map((m) => m.trim()).filter(Boolean);
  const closed = !preview && r.deadline && dayjs().isAfter(dayjs(r.deadline).endOf('day'));
  const max = Math.max(1, Number(r.maxGuests) || 1);

  const submit = async (values) => {
    if (preview) {
      toast('Preview only — responses are not saved from the editor.', { icon: '👀' });
      return;
    }
    try {
      await onSubmit({
        guestName: values.guestName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        attending: values.attending,
        guestCount: values.attending === 'no' ? 0 : Math.min(max, Number(values.guestCount) || 1),
        message: values.message.trim(),
        mealPreference: values.attending === 'no' ? '' : values.mealPreference,
      });
      setDone({ name: values.guestName.trim(), attending: values.attending });
    } catch (e) {
      toast.error(e.message || 'We could not send your response. Please try again.');
    }
  };

  if (closed) {
    return <p className="inv-card" style={{ marginTop: '2rem' }}>The RSVP deadline has passed. Please contact the host directly.</p>;
  }

  if (done) {
    return (
      <div className="inv-thanks" role="status">
        <CheckCircle2 size={44} className="inv-accent" style={{ margin: '0 auto 1rem' }} />
        <h3 className="inv-h" style={{ fontSize: '2em' }}>Thank you, {done.name.split(' ')[0]}!</h3>
        <p className="inv-soft" style={{ marginTop: '.5rem' }}>
          {done.attending === 'no' ? 'We will miss you, and we appreciate you letting us know.' : 'Your response has been received. We cannot wait to celebrate with you!'}
        </p>
        <div className="inv-btns">
          <button className="inv-btn ghost" onClick={() => { reset(); setDone(null); }}>Respond for someone else</button>
        </div>
      </div>
    );
  }

  return (
    <form className="inv-form" onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <label className="l" htmlFor="rsvp-name">Full name *</label>
        <input id="rsvp-name" className="inv-input" autoComplete="name" placeholder="Your full name"
          {...register('guestName', { required: 'Please tell us your name.', minLength: { value: 2, message: 'Name is too short.' } })} />
        {errors.guestName && <p className="inv-err">{errors.guestName.message}</p>}
      </div>

      <div className="two">
        <div>
          <label className="l" htmlFor="rsvp-email">Email (optional)</label>
          <input id="rsvp-email" type="email" className="inv-input" autoComplete="email" placeholder="you@email.com"
            {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email does not look right.' } })} />
          {errors.email && <p className="inv-err">{errors.email.message}</p>}
        </div>
        <div>
          <label className="l" htmlFor="rsvp-phone">Contact number (optional)</label>
          <input id="rsvp-phone" type="tel" className="inv-input" autoComplete="tel" placeholder="+63 900 000 0000"
            {...register('phone', { pattern: { value: /^[+\d][\d\s()-]{5,}$/, message: 'Enter a valid number.' } })} />
          {errors.phone && <p className="inv-err">{errors.phone.message}</p>}
        </div>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="l" style={{ padding: 0 }}>Will you attend? *</legend>
        <div className="inv-choices">
          {CHOICES.map((c) => (
            <label key={c.value} className="inv-choice">
              <input type="radio" value={c.value} {...register('attending', { required: true })} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {attending !== 'no' && (
        <div className="two">
          {r.allowPlusOnes && max > 1 && (
            <div>
              <label className="l" htmlFor="rsvp-count">Number of guests</label>
              <select id="rsvp-count" className="inv-input" {...register('guestCount')}>
                {Array.from({ length: max }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? '(just me)' : 'guests'}</option>)}
              </select>
            </div>
          )}
          {meals.length > 0 && (
            <div>
              <label className="l" htmlFor="rsvp-meal">Meal preference</label>
              <select id="rsvp-meal" className="inv-input" {...register('mealPreference')}>
                <option value="">No preference</option>
                {meals.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {r.collectNote !== false && (
        <div>
          <label className="l" htmlFor="rsvp-msg">Message to the host (optional)</label>
          <textarea id="rsvp-msg" rows={3} className="inv-input" placeholder="Share your wishes or any dietary needs…" {...register('message')} />
        </div>
      )}

      <button className="inv-btn" type="submit" disabled={isSubmitting} style={{ justifySelf: 'center', minWidth: '12em' }}>
        <Send size={16} /> {isSubmitting ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  );
}
