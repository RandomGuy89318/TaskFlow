// This script creates test accounts in Supabase using REST API
// Run with: npx tsx scripts/create-test-accounts-simple.ts

const supabaseUrl = 'https://kukgcihwnnjhflclnkhr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1a2djaWh3bm5qaGZsY2xua2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTEzMjE5NywiZXhwIjoyMDk0NzA4MTk3fQ.-WZPlm884SoQjkWvV8xbXbihkBAatf29nFCeC4mky9g';

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
      // Create auth user using REST API
      const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {
            name: account.name,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Error creating account for ${account.email}:`, error);
        continue;
      }

      const data = await response.json();
      console.log(`✓ Created account: ${account.email} (${account.name})`);

      // Create profile
      const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          id: data.id,
          email: account.email,
          full_name: account.name,
        }),
      });

      if (!profileResponse.ok) {
        console.error(`Error creating profile for ${account.email}`);
      } else {
        console.log(`✓ Created profile for ${account.email}`);
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
