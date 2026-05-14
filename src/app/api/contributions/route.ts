import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tanda_id, member_id, round, amount, arbitrum_tx_hash } = body as {
      tanda_id: string;
      member_id: string;
      round: number;
      amount: number;
      arbitrum_tx_hash?: string | null;
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
        status: arbitrum_tx_hash ? 'confirmed' : 'pending',
        arbitrum_tx_hash,
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
