import type { Metadata } from 'next';
import CompaniesClient from './CompaniesClient';

export const metadata: Metadata = {
  title: 'Companies',
  description: 'GO Companies — owners, operators and counterparties.',
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
