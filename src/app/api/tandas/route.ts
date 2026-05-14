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

    const {
      name,
      description,
      contribution_amount,
      frequency,
      max_members,
      total_rounds,
    } = body;

    // Validate required fields
    if (!name || !contribution_amount || !frequency || !max_members || !total_rounds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert tanda
    const { data: tanda, error } = await supabase
      .from('tandas')
      .insert({
        name,
        description,
        contribution_amount,
        frequency,
        max_members,
        total_rounds,
        status: 'forming',
        creator_id: session.user.id,
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (error) throw error;

    // Add creator as the first member (admin/organizer)
    const { error: memberError } = await supabase
      .from('tanda_members')
      .insert({
        tanda_id: tanda.id,
        user_id: session.user.id,
        wallet_address: '0x0000000000000000000000000000000000000000', // Placeholder until wallet is connected
        display_name: session.user.email?.split('@')[0] || 'Creator',
        payout_position: 1,
        trust_score: 100, // Creator gets high trust score initially
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (memberError) {
      console.error('Failed to add creator as member:', memberError);
      // Non-fatal for the endpoint, but log it
    }

    return NextResponse.json({ success: true, tanda }, { status: 201 });
  } catch (error) {
    console.error('Tanda creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
