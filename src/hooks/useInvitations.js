import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { invitations as api, rsvps as rsvpApi } from '../services';

/** Loads the signed-in user's invitations and RSVP summary rows, with mutation helpers. */
export function useInvitations() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) return;
    try {
      const [inv, r] = await Promise.all([api.list(user.id), rsvpApi.listForUser(user.id)]);
      setItems(inv);
      setRsvps(r);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  const remove = async (id) => {
    await api.remove(id);
    setItems((l) => l.filter((i) => i.id !== id));
    setRsvps((l) => l.filter((r) => r.invitationId !== id));
    toast.success('Invitation deleted');
  };

  const duplicate = async (id) => {
    const copy = await api.duplicate(id, user.id);
    toast.success('Invitation duplicated');
    await reload();
    return copy;
  };

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === 'published').length,
    views: items.reduce((n, i) => n + (i.viewCount || 0), 0),
    responses: rsvps.length,
    confirmed: rsvps.filter((r) => r.attending === 'yes').reduce((n, r) => n + (Number(r.guestCount) || 0), 0),
  };

  return { items, rsvps, loading, reload, remove, duplicate, stats, setItems };
}
