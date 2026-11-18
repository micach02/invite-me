import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/ui/misc';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6">
      <EmptyState icon={Compass} title="This page wandered off" text="The link may be broken or the page may have moved."
        action={<Link to="/" className="btn-primary">Back to home</Link>} />
    </div>
  );
}
