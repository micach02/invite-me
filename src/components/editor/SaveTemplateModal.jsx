import { useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import { useLibrary } from '../../context/LibraryContext';
import { occasionById } from '../../data/constants';
import { TEMPLATES } from '../../data/templates';

/** Saves the invitation's current design (colours, fonts, layout, decoration, motion) as a reusable template. */
export default function SaveTemplateModal({ open, onClose, config }) {
  const { saved, find, saveTemplate } = useLibrary();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const currentId = config.theme.templateId;
  const base = find(currentId);
  // A saved design keeps pointing at the built-in template it started from, so its sample content stays sensible.
  const baseId = base?.custom ? base.baseId : (TEMPLATES.some((t) => t.id === currentId) ? currentId : undefined);

  useLayoutEffect(() => { if (open) setName(`${base?.name ?? 'My'} (custom)`.slice(0, 40)); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e?.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    setBusy(true);
    try {
      // The logo belongs to this invitation, not the design, so its size/placement stay out of the saved template.
      // eslint-disable-next-line no-unused-vars
      const { templateId, logoSize, logoPlacement, ...theme } = config.theme;
      await saveTemplate({
        name: clean, occasion: config.meta?.occasion ?? base?.occasion ?? 'wedding', baseId,
        style: base?.style, mood: base?.mood, colorFamily: base?.colorFamily, theme,
      });
      toast.success('Saved to My templates');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="Save as template" size="sm"
      footer={<>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" form="save-template-form" className="btn-primary" disabled={busy || !name.trim()}>{busy ? 'Saving…' : 'Save template'}</button>
      </>}
    >
      <form id="save-template-form" onSubmit={submit} className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          Keeps this design — colours, fonts, layout, decoration and animations — so you can start future {occasionById(config.meta?.occasion).label.toLowerCase()} invitations from it.
          Your words and photos aren’t included.
        </p>
        <div>
          <label className="label" htmlFor="tpl-name">Template name</label>
          <input id="tpl-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus onFocus={(e) => e.target.select()} />
        </div>
        {saved.length > 0 && <p className="text-xs text-ink-mute">You have {saved.length} saved template{saved.length === 1 ? '' : 's'}. <Link className="font-medium text-brand hover:underline" to="/templates?view=mine">View them</Link></p>}
      </form>
    </Modal>
  );
}
