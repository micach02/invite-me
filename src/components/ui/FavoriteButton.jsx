import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';

/** Heart toggle for a template. Signed-out visitors are sent to log in first. */
export default function FavoriteButton({ id, name, className = '' }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const on = isFavorite(id);

  const click = (e) => {
    e.stopPropagation();
    if (!user) {
      toast('Log in to save favorites.');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleFavorite(id).then((ok) => { if (ok) toast.success(on ? 'Removed from favorites' : 'Added to favorites', { duration: 1800 }); });
  };

  return (
    <button
      type="button" onClick={click} aria-pressed={on} data-favorite={id}
      aria-label={on ? `Remove ${name} from favorites` : `Add ${name} to favorites`} title={on ? 'Remove from favorites' : 'Add to favorites'}
      className={`grid h-8 w-8 place-items-center rounded-full bg-surface/90 shadow-sm ring-1 ring-ink/5 backdrop-blur transition hover:scale-110 active:scale-95 ${on ? 'text-rose-500' : 'text-ink-soft hover:text-rose-500'} ${className}`}
    >
      <Heart size={16} strokeWidth={2} className={on ? 'fill-current' : ''} />
    </button>
  );
}
