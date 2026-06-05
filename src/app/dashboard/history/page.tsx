import { createClient } from '@/lib/supabase/server';
import { ESCROW_ADDRESS } from '@/lib/constants';
import { HistoryList, type HistoryRow } from './HistoryList';

export default async function HistoryPage() {
  const supabase = await createClient();

  // Shared DB: scope history to this network's tandas via their escrow address.
  const { data: networkTandas } = await supabase
    .from('tandas')
    .select('id')
    .eq('escrow_address', ESCROW_ADDRESS);
  const tandaIds = (networkTandas ?? []).map((t) => (t as { id: string }).id);

  const { data } = await supabase
    .from('contributions')
    .select('id, tanda_id, amount, status, created_at, botchain_tx_hash')
    .in('tanda_id', tandaIds)
    .order('created_at', { ascending: false })
    .limit(50);

  return <HistoryList contributions={(data as HistoryRow[]) ?? []} />;
}
