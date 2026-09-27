import type { Metadata } from 'next';
import MapsClient from './MapsClient';
import { VESSELS } from '@/data/vessels';

export const metadata: Metadata = {
  title: 'Maps & Layers',
  description: 'GO Maps & Layers — spatial intelligence for the offshore fleet.',
};

export default function MapsPage() {
  // Only vessels carrying a position are sent to the browser — the full
  // database has no business in a map component.
  const positioned = VESSELS.filter((v) => v.position).map((v) => ({
    id: v.id,
    name: v.name,
    subType: v.subType,
    status: v.status,
  }));
  return <MapsClient positioned={positioned} />;
}
