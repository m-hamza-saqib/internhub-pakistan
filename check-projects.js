
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
  console.log('--- Checking Internship Projects ---');
  
  // Get all internships
  const { data: internships } = await supabase
    .from('internships')
    .select('id, title');
  
  for (const intern of internships || []) {
    const { count } = await supabase
      .from('internship_projects')
      .select('id', { count: 'exact', head: true })
      .eq('internship_id', intern.id);
    console.log(`Internship: ${intern.title} (${intern.id}) - Projects: ${count}`);
  }
}

checkProjects();
