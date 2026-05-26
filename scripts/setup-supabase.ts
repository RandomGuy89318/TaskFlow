// This script sets up the Supabase database schema and creates test accounts
// Run with: npx tsx scripts/setup-supabase.ts

import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Get from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function setupDatabase() {
  console.log('Setting up Supabase database...');

  // Create users table schema
  const { error: usersError } = await supabase.rpc('create_users_table');
  if (usersError) {
    console.error('Error creating users table:', usersError);
  }

  // Create tasks table schema
  const { error: tasksError } = await supabase.rpc('create_tasks_table');
  if (tasksError) {
    console.error('Error creating tasks table:', tasksError);
  }

  // Create projects table schema
  const { error: projectsError } = await supabase.rpc('create_projects_table');
  if (projectsError) {
    console.error('Error creating projects table:', projectsError);
  }

  // Create test accounts
  console.log('Creating test accounts...');
  for (const account of testAccounts) {
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          name: account.name,
        },
      },
    });

    if (error) {
      console.error(`Error creating account for ${account.email}:`, error);
    } else {
      console.log(`✓ Created account: ${account.email}`);
    }
  }

  console.log('\n=== Test Accounts Created ===');
  testAccounts.forEach(account => {
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${account.password}`);
    console.log(`Name: ${account.name}`);
    console.log('---');
  });

  console.log('\nSetup complete!');
}

setupDatabase().catch(console.error);
