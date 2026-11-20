import Modal from '../ui/Modal';

const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
const MOD = mac ? '⌘' : 'Ctrl';

const GROUPS = [
  ['Editing', [
    [[MOD, 'S'], 'Save now'],
    [[MOD, 'Z'], 'Undo'],
    [[MOD, 'Shift', 'Z'], 'Redo (or ' + MOD + ' Y)'],
  ]],
  ['Around the editor', [
    [['?'], 'Show this list'],
    [['Esc'], 'Close a menu or dialog'],
  ]],
  ['In the preview', [
    [['Click'], 'Click any section to jump to its settings'],
    [['Drag'], 'Drag rows in “Page order” to rearrange sections'],
  ]],
];

const Key = ({ children }) => <kbd className="inline-grid min-w-[1.6rem] place-items-center rounded-md border border-line-strong bg-canvas px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft shadow-[0_1px_0_rgb(var(--c-line-strong))]">{children}</kbd>;

export default function ShortcutsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts & tips" size="sm">
      <div className="space-y-5">
        {GROUPS.map(([title, rows]) => (
          <section key={title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{title}</h3>
            <ul className="mt-2 divide-y divide-line">
              {rows.map(([keys, label]) => (
                <li key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <span className="text-ink-soft">{label}</span>
                  <span className="flex shrink-0 items-center gap-1">{keys.map((k) => <Key key={k}>{k}</Key>)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}
