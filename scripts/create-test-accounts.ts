// This script creates test accounts in Supabase
// Run with: npx tsx scripts/create-test-accounts.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kukgcihwnnjhflclnkhr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1a2djaWh3bm5qaGZsY2xua2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTEzMjE5NywiZXhwIjoyMDk0NzA4MTk3fQ.-WZPlm884SoQjkWvV8xbXbihkBAatf29nFCeC4mky9g';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test accounts to create
const testAccounts = [
  {
    email: 'test1@example.com',
    password: 'Test123456!',
    name: 'Test User 1',
  },
  {
    email: 'test2@example.com',
    password: 'Test123456!',
    name: 'Test User 2',
  },
  {
    email: 'test3@example.com',
    password: 'Test123456!',
    name: 'Test User 3',
  },
  {
    email: 'admin@example.com',
    password: 'Admin123456!',
    name: 'Admin User',
  },
  {
    email: 'demo@example.com',
    password: 'Demo123456!',
    name: 'Demo User',
  },
];

async function createTestAccounts() {
  console.log('Creating test accounts in Supabase...\n');

  for (const account of testAccounts) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            name: account.name,
          },
        },
      });

      if (authError) {
        console.error(`Error creating auth user for ${account.email}:`, authError);
        continue;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: account.email,
            full_name: account.name,
          });

        if (profileError) {
          console.error(`Error creating profile for ${account.email}:`, profileError);
        } else {
          console.log(`✓ Created account: ${account.email} (${account.name})`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${account.email}:`, error);
    }
  }

  console.log('\n=== Test Accounts Created ===\n');
  testAccounts.forEach(account => {
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${account.password}`);
    console.log(`Name: ${account.name}`);
    console.log('---');
  });

  console.log('\nYou can now use these accounts to test the application!');
}

createTestAccounts().catch(console.error);
