import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { createAdminClient } from '@/lib/supabase/server';
import { ESCROW_ADDRESS } from '@/lib/constants';

/**
 * Create a tanda from the connected wallet. This app authenticates with a
 * wallet (not a Supabase session), so writes go through the service-role
 * admin client and are keyed on the creator's wallet address.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      contribution_amount,
      frequency,
      max_members,
      creator_wallet,
      creator_name,
    } = body as {
      name?: string;
      description?: string;
      contribution_amount?: number;
      frequency?: string;
      max_members?: number;
      creator_wallet?: string;
      creator_name?: string;
    };

    if (!name || !contribution_amount || !frequency || !max_members) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!creator_wallet || !isAddress(creator_wallet)) {
      return NextResponse.json({ error: 'Valid creator wallet required' }, { status: 400 });
    }
    if (!['weekly', 'biweekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // In a tanda, the number of rounds equals the number of members.
    const total_rounds = Number(max_members);

    const { data: tanda, error } = await supabase
      .from('tandas')
      .insert({
        name,
        description: description ?? null,
        contribution_amount: Number(contribution_amount),
        frequency,
        max_members: Number(max_members),
        total_rounds,
        status: 'forming',
        escrow_address: ESCROW_ADDRESS,
      } as never)
      .select()
      .single();

    if (error) throw error;
    const created = tanda as { id: string };

    // The creator becomes the first member (organizer) with their real wallet.
    const { error: memberError } = await supabase
      .from('tanda_members')
      .insert({
        tanda_id: created.id,
        wallet_address: creator_wallet,
        display_name: creator_name || `${creator_wallet.slice(0, 6)}…${creator_wallet.slice(-4)}`,
        payout_position: 1,
        trust_score: 100,
      } as never);

    if (memberError) {
      console.error('Failed to add creator as member:', memberError);
    }

    return NextResponse.json({ success: true, tanda: created }, { status: 201 });
  } catch (error) {
    console.error('Tanda creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
