import { createClient } from '@/lib/supabase/server';
import { HistoryList, type HistoryRow } from './HistoryList';

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('contributions')
    .select('id, tanda_id, amount, status, created_at, botchain_tx_hash')
    .order('created_at', { ascending: false })
    .limit(50);

  return <HistoryList contributions={(data as HistoryRow[]) ?? []} />;
}
