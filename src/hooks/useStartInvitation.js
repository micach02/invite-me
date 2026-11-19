import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { invitations } from '../services';
import { templateConfig } from '../data/defaultConfig';

/** Creates a draft invitation from a template and opens it in the editor (or sends guests to sign up first). */
export function useStartInvitation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);

  const start = async (tpl) => {
    if (!user) {
      navigate('/register', { state: { from: `/templates?use=${tpl.id}` } });
      return;
    }
    setBusyId(tpl.id);
    try {
      const config = templateConfig(tpl);
      const inv = await invitations.create(user.id, { title: config.event.title, occasion: tpl.occasion, templateId: tpl.id, config });
      navigate(`/editor/${inv.id}`);
    } catch (e) {
      toast.error(e.message);
      setBusyId(null);
    }
  };
  return { start, busyId };
}
