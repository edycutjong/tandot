import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Wallet-authenticated app (no Supabase session) — write via the
    // service-role admin client after validating the payload.
    const supabase = await createAdminClient();
    const body = await request.json();

    const { tanda_id, member_id, round, amount, botchain_tx_hash } = body as {
      tanda_id: string;
      member_id: string;
      round: number;
      amount: number;
      botchain_tx_hash?: string | null;
    };

    // Validate required fields
    if (!tanda_id || !member_id || !round || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert contribution
    const { data: contribution, error } = await supabase
      .from('contributions')
      .insert({
        tanda_id,
        member_id,
        round,
        amount,
        currency: 'MXNB',
        status: botchain_tx_hash ? 'confirmed' : 'pending',
        botchain_tx_hash,
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, contribution }, { status: 201 });
  } catch (error) {
    console.error('Contribution logging error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
