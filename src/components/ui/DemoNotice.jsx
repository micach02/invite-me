import { TriangleAlert } from 'lucide-react';

/**
 * Shown wherever a public link/QR is promised. In demo mode data lives in this browser only, so the link
 * works here and nowhere else — better to say so than to hand out a QR code that silently fails.
 */
export default function DemoNotice({ compact = false }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="note">
      <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium">Demo mode — this link only works in this browser.</p>
        {!compact && (
          <p className="mt-1 text-amber-800">
            Invitations are stored on this device, so guests who scan the QR code or open the link on another phone will see
            “Invitation not found”. Connect Supabase (see the README) to publish invitations that anyone can open.
          </p>
        )}
      </div>
    </div>
  );
}
