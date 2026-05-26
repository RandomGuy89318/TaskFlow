import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = 'https://kukgcihwnnjhflclnkhr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1a2djaWh3bm5qaGZsY2xua2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTEzMjE5NywiZXhwIjoyMDk0NzA4MTk3fQ.-WZPlm884SoQjkWvV8xbXbihkBAatf29nFCeC4mky9g';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  },
  realtime: {
    transport: ws as any
  }
});

async function createMissingProfiles() {
  try {
    console.log('Fetching users from auth.users...');

    // Get all users from auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error fetching users:', listError);
      return;
    }

    console.log(`Found ${users.length} users`);

    let createdCount = 0;
    let alreadyExistsCount = 0;

    for (const user of users) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        console.log(`Profile already exists for ${user.email}`);
        alreadyExistsCount++;
        continue;
      }

      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        });

      if (insertError) {
        console.error(`Error creating profile for ${user.email}:`, insertError);
      } else {
        console.log(`Created profile for ${user.email}`);
        createdCount++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Created: ${createdCount} profiles`);
    console.log(`- Already existed: ${alreadyExistsCount} profiles`);
    console.log(`- Total users: ${users.length}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

createMissingProfiles();
