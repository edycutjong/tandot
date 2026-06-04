import { createClient } from '@/lib/supabase/server';
import { AITrustList, type TrustMember } from './AITrustList';

export default async function AITrustPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('tanda_members')
    .select('id, display_name, wallet_address, trust_score')
    .order('trust_score', { ascending: false })
    .limit(100);

  // A wallet can be a member of several tandas — show each person once.
  const seen = new Set<string>();
  const members = ((data as TrustMember[]) ?? []).filter((m) => {
    if (seen.has(m.wallet_address)) return false;
    seen.add(m.wallet_address);
    return true;
  });

  return <AITrustList members={members} />;
}
