import type { Metadata } from 'next';
import AIClient from './AIClient';
import { VESSELS } from '@/data/vessels';
import { COMPANIES } from '@/data/companies';

export const metadata: Metadata = {
  title: 'GO AI',
  description: 'GO AI — one query answered across every module.',
};

export default function AIPage() {
  // Only the answer travels to the browser, not the datasets behind it.
  return <AIClient hasRecords={VESSELS.length > 0 || COMPANIES.length > 0} />;
}
