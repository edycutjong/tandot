import { createClient } from '@supabase/supabase-js';
import { MOCK_TANDAS, MOCK_MEMBERS, MOCK_CONTRIBUTIONS, MOCK_PAYOUTS } from '../src/lib/mock-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Supabase with mock data...');

  // Seed Tandas
  console.log('Inserting Tandas...');
  const { error: tandasError } = await supabase.from('tandas').upsert(MOCK_TANDAS);
  if (tandasError) {
    console.error('Error inserting tandas:', tandasError);
  } else {
    console.log(`Successfully inserted ${MOCK_TANDAS.length} tandas.`);
  }

  // Seed Members
  console.log('Inserting Members...');
  const { error: membersError } = await supabase.from('tanda_members').upsert(MOCK_MEMBERS);
  if (membersError) {
    console.error('Error inserting members:', membersError);
  } else {
    console.log(`Successfully inserted ${MOCK_MEMBERS.length} members.`);
  }

  // Seed Contributions
  console.log('Inserting Contributions...');
  const { error: contribError } = await supabase.from('contributions').upsert(MOCK_CONTRIBUTIONS);
  if (contribError) {
    console.error('Error inserting contributions:', contribError);
  } else {
    console.log(`Successfully inserted ${MOCK_CONTRIBUTIONS.length} contributions.`);
  }

  // Seed Payouts
  console.log('Inserting Payouts...');
  const { error: payoutError } = await supabase.from('payouts').upsert(MOCK_PAYOUTS);
  if (payoutError) {
    console.error('Error inserting payouts:', payoutError);
  } else {
    console.log(`Successfully inserted ${MOCK_PAYOUTS.length} payouts.`);
  }

  console.log('Seeding completed!');
}

seed().catch(console.error);
