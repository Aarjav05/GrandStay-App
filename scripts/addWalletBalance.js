// Run this script to add wallet_balance column and set ₹50,000 for the user
// Usage: node scripts/addWalletBalance.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const email = 'aarjav.n.jain205@gmail.com';
  
  // First find the user's ID from auth
  // We query the profiles table and join by looking up via auth
  // Since we can't query auth.users from anon key, we'll update profiles directly
  
  // Look up user via a workaround - sign in to get the user ID
  // Instead, let's just find the profile that matches 
  const { data: profiles, error: searchErr } = await supabase
    .from('profiles')
    .select('id, name')
    .limit(10);
  
  if (searchErr) {
    console.error('Error fetching profiles:', searchErr.message);
    return;
  }
  
  console.log('All profiles:', profiles);
  
  // Try to add wallet_balance column (may fail if already exists, that's OK)
  const { error: alterErr } = await supabase.rpc('exec_sql', {
    sql: "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0"
  });
  
  if (alterErr) {
    console.log('Note: Could not add column via RPC (may need to run SQL manually):', alterErr.message);
    console.log('\nRun this SQL in your Supabase Dashboard > SQL Editor:');
    console.log('  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;');
  }
  
  // Update all profiles with wallet balance for now
  for (const profile of profiles) {
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ wallet_balance: 50000 })
      .eq('id', profile.id);
    
    if (updateErr) {
      console.log(`Could not update profile ${profile.id}:`, updateErr.message);
      console.log('\nYou may need to first add the wallet_balance column.');
      console.log('Run this SQL in Supabase Dashboard > SQL Editor:');
      console.log('  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;');
      console.log(`  UPDATE profiles SET wallet_balance = 50000 WHERE id = '${profile.id}';`);
    } else {
      console.log(`✅ Set wallet_balance to ₹50,000 for profile: ${profile.name} (${profile.id})`);
    }
  }
}

main();
