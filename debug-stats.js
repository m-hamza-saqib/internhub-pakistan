
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStats() {
  console.log('--- Debugging Admin Stats ---');
  
  // Total Users
  const { count: userCount, error: userError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });
  console.log('Total Profiles in DB:', userCount);
  if (userError) console.error('User Error:', userError);

  // Active Enrollments
  const { count: activeCount, error: enrollError } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active'); // Corrected from is_completed
  console.log('Active Enrollments (status=active):', activeCount);
  if (enrollError) console.error('Enroll Error:', enrollError);

  // Check specific user: Hamza Sial (ladla8819@gmail.com)
  const { data: hamza, error: hamzaError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('email', 'ladla8819@gmail.com')
    .maybeSingle();
  console.log('Hamza Sial Profile:', hamza);
  
  if (hamza) {
    const { data: enrolls } = await supabase
      .from('enrollments')
      .select('*, internships(title)')
      .eq('user_id', hamza.id);
    console.log('Hamza Enrollments:', JSON.stringify(enrolls, null, 2));
    
    if (enrolls && enrolls.length > 0) {
        const { data: subs } = await supabase
            .from('project_submissions')
            .select('*, internship_projects(title)')
            .eq('enrollment_id', enrolls[0].id);
        console.log('Hamza Submissions:', JSON.stringify(subs, null, 2));
        
        const { data: projs } = await supabase
            .from('internship_projects')
            .select('*')
            .eq('internship_id', enrolls[0].id);
        console.log('Internship Projects available:', JSON.stringify(projs, null, 2));
    }
  }

  // Check internships spots
  const { data: internships } = await supabase
    .from('internships')
    .select('id, title, spots_filled, spots_total');
  console.log('Internships Spots:', JSON.stringify(internships, null, 2));
}

debugStats();
