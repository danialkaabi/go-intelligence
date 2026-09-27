import AppShell from '@/components/app/AppShell';
import { VESSELS } from '@/data/vessels';
import { COMPANIES } from '@/data/companies';
import { CONTRACTS } from '@/data/contracts';
import { TENDERS } from '@/data/tenders';
import { ALERTS } from '@/data/alerts';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  // Counted here, on the server, so the sidebar badges cost the browser
  // nothing beyond five integers.
  const counts = {
    vessels: VESSELS.length,
    companies: COMPANIES.length,
    contracts: CONTRACTS.length,
    tenders: TENDERS.length,
    alerts: ALERTS.filter((a) => !a.read).length,
  };
  return <AppShell counts={counts}>{children}</AppShell>;
}
