import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const internshipsData = [
  {
    title: 'Full Stack Web Development with Next.js',
    category: 'engineering',
    description: 'Master modern full-stack development by building a production-ready application using Next.js 14, React, TypeScript, and Supabase. You will learn to construct robust APIs, handle authentication, manage state, and deploy your application with CI/CD pipelines.',
    what_you_learn: '- Building server-rendered React applications with Next.js App Router\n- Implementing secure authentication and authorization using Supabase Auth\n- Designing scalable relational databases with PostgreSQL\n- Writing clean, type-safe code using TypeScript\n- Deploying applications to Vercel with automated GitHub actions',
    requirements: '- Basic proficiency in JavaScript/ES6+\n- Understanding of fundamental React concepts (hooks, components)\n- Familiarity with basic web technologies (HTML, CSS)\n- A working computer with Node.js and a code editor (like VS Code) installed',
    duration_weeks: 8,
    difficulty: 'intermediate',
    spots_total: 50,
    spots_filled: 12,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Portfolio Website', description: 'Create a responsive personal portfolio using Next.js and Tailwind CSS to showcase your skills and resume.', week_number: 1 },
      { title: 'Blog Platform', description: 'Build a CMS-driven blog using Supabase for the database, implementing read and write operations.', week_number: 3 },
      { title: 'Authentication System', description: 'Integrate Supabase Auth to provide email/password and OAuth login functionality to your application.', week_number: 5 },
      { title: 'E-commerce Dashboard', description: 'Develop a comprehensive admin dashboard to manage products, view orders, and visualize sales data using a charting library.', week_number: 8 }
    ]
  },
  {
    title: 'Data Science and Machine Learning Accelerator',
    category: 'data',
    description: 'Dive deep into the world of Data Science. This internship covers data pre-processing, exploratory data analysis (EDA), statistical modeling, and hands-on application of classical Machine Learning algorithms using Python.',
    what_you_learn: '- Data manipulation and analysis using Pandas and NumPy\n- Creating compelling data visualizations with Matplotlib and Seaborn\n- Training, tuning, and evaluating predictive models with Scikit-Learn\n- Understanding underlying mathematical concepts of ML algorithms\n- Using Jupyter Notebooks for reporting and code sharing',
    requirements: '- Basic programming knowledge in Python\n- High school level understanding of statistics and probability\n- Enthusiasm for problem-solving and analytical thinking',
    duration_weeks: 10,
    difficulty: 'advanced',
    spots_total: 30,
    spots_filled: 28,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Exploratory Data Analysis Report', description: 'Perform EDA on a real-world dataset, clean missing values, and extract meaningful insights through visual dashboards.', week_number: 2 },
      { title: 'Predictive Pricing Model', description: 'Train a regression model to predict housing prices based on multiple features like location, size, and amenities.', week_number: 5 },
      { title: 'Customer Segmentation', description: 'Apply unsupervised learning (K-Means clustering) to segment customers based on purchasing behavior for targeted marketing.', week_number: 8 },
      { title: 'End-to-End ML Pipeline', description: 'Build a complete pipeline that ingests raw data, processes it, trains a model, and exposes it via a simple Flask API.', week_number: 10 }
    ]
  },
  {
    title: 'UI/UX Design Essentials',
    category: 'design',
    description: 'Learn the principles of user-centered design and transform your creative ideas into interactive prototypes. This program focuses on wireframing, high-fidelity UI design, user research, and usability testing using Figma.',
    what_you_learn: '- Conducting user research and creating user personas\n- Designing wireframes, mockups, and interactive prototypes in Figma\n- Applying color theory, typography, and visual hierarchy\n- Designing intuitive and accessible user interfaces\n- Conducting usability tests and iterating on design feedback',
    requirements: '- No prior technical experience required\n- A keen eye for visual aesthetics\n- A reliable internet connection to access web-based design tools',
    duration_weeks: 6,
    difficulty: 'beginner',
    spots_total: 100,
    spots_filled: 45,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'User Persona Creation', description: 'Research and define detailed user personas for a fictional mobile banking application.', week_number: 1 },
      { title: 'Low-Fidelity Wireframing', description: 'Sketch out the user flow and create low-fidelity wireframes for the core screens of the application.', week_number: 3 },
      { title: 'High-Fidelity UI Design', description: 'Apply branding, typography, and advanced styling to convert your wireframes into polished UI screens.', week_number: 5 },
      { title: 'Interactive Prototype', description: 'Link your high-fidelity screens in Figma to create a clickable prototype and simulate the user journey.', week_number: 6 }
    ]
  },
  {
    title: 'Digital Marketing & SEO Strategies',
    category: 'marketing',
    description: 'Gain practical experience in digital marketing campaigns. You will learn content strategy, search engine optimization (SEO), social media management, and performance analytics to drive traffic and user engagement.',
    what_you_learn: '- Optimizing on-page and off-page SEO for better search rankings\n- Creating effective social media content calendars\n- Running targeted ad campaigns on Google and Facebook\n- Analyzing website traffic and campaign performance using Google Analytics\n- Formulating an overarching digital marketing strategy',
    requirements: '- Strong written communication skills\n- Familiarity with popular social media platforms\n- An interest in understanding human behavior and market trends',
    duration_weeks: 6,
    difficulty: 'beginner',
    spots_total: 75,
    spots_filled: 70,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'SEO Site Audit', description: 'Analyze an existing website and provide a detailed report outlining areas for SEO improvement.', week_number: 2 },
      { title: 'Content Calendar Campaign', description: 'Design a 30-day cross-platform social media calendar for a product launch.', week_number: 4 },
      { title: 'Ad Strategy and Budgeting', description: 'Draft a proposal for a paid marketing campaign, defining target demographics, ad copy, and budget allocation.', week_number: 6 }
    ]
  },
  {
    title: 'Product Management Fundamentals',
    category: 'product',
    description: 'Step into the shoes of a Product Manager. Learn how to guide a product through its lifecycle from ideation to launch. This track covers agile methodologies, roadmap planning, and stakeholder communication.',
    what_you_learn: '- Writing clear product requirement documents (PRDs) and user stories\n- Prioritizing features using frameworks like RICE or MoSCoW\n- Understanding agile and scrum methodologies\n- Analyzing market trends and competitive landscapes\n- Aligning cross-functional teams (engineering, design, sales)',
    requirements: '- Excellent organizational and leadership skills\n- Ability to think strategically and analytically\n- Basic understanding of software development lifecycles is a plus',
    duration_weeks: 8,
    difficulty: 'intermediate',
    spots_total: 40,
    spots_filled: 20,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Market Research Report', description: 'Conduct a competitive analysis for a new travel application comparing at least 3 major competitors.', week_number: 2 },
      { title: 'PRD Creation', description: 'Write a comprehensive Product Requirement Document for a new feature to be added to an existing e-commerce app.', week_number: 5 },
      { title: 'Product Roadmap Presentation', description: 'Create and present a 6-month product roadmap utilizing a visual prioritization framework.', week_number: 8 }
    ]
  },
  {
    title: 'Cloud Computing with AWS',
    category: 'operations',
    description: 'Learn to design, deploy, and manage scalable cloud architectures on Amazon Web Services (AWS). This program provides hands-on experience with core cloud services like EC2, S3, RDS, and Lambda.',
    what_you_learn: '- Provisioning virtual servers and configuring isolated networks (VPC)\n- Managing scalable object storage and relational databases in the cloud\n- Deploying applications automatically using CI/CD and Infrastructure as Code\n- Implementing serverless functions for event-driven architectures\n- Best practices for cloud security and cost optimization',
    requirements: '- Basic understanding of networking concepts\n- Familiarity with the Linux command line\n- An active AWS Free Tier account',
    duration_weeks: 10,
    difficulty: 'advanced',
    spots_total: 35,
    spots_filled: 30,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Static Website Hosting', description: 'Deploy a secure, highly-available static website using Amazon S3, CloudFront, and Route 53.', week_number: 2 },
      { title: 'Three-Tier Architecture Deployment', description: 'Set up a classic web application architecture using EC2, a load balancer, and RDS within a custom VPC.', week_number: 6 },
      { title: 'Serverless Image Processor', description: 'Build an event-driven system using AWS Lambda that automatically resizes images uploaded to an S3 bucket.', week_number: 10 }
    ]
  },
  {
    title: 'Mobile App Development with React Native',
    category: 'engineering',
    description: 'Build native iOS and Android applications using a single JavaScript codebase. This intensive track covers React Native fundamentals, navigation, device hardware access, and app store deployment.',
    what_you_learn: '- Designing mobile-first interfaces with React Native components\n- Managing complex nested navigation flows\n- Persisting data locally and fetching remote APIs\n- Accessing native device features like the camera and location services\n- Preparing and publishing apps to the App Store and Google Play',
    requirements: '- Strong foundation in JavaScript and React\n- A physical mobile device or configured emulator for testing\n- Mac OS is required if intending to compile for iOS',
    duration_weeks: 12,
    difficulty: 'advanced',
    spots_total: 25,
    spots_filled: 25,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Habit Tracker App', description: 'Create a local-only mobile app that tracks daily habits using React Native components and AsyncStorage.', week_number: 4 },
      { title: 'Weather Application', description: 'Build an app that uses GPS location to fetch and display real-time weather data from a public API.', week_number: 8 },
      { title: 'Social Media Feed Prototype', description: 'Develop a highly interactive feed application featuring continuous scrolling, like animations, and image uploading.', week_number: 12 }
    ]
  },
  {
    title: 'Cybersecurity Fundamentals & Ethical Hacking',
    category: 'operations',
    description: 'An introduction to information security, covering vulnerability assessment, penetration testing techniques, and defensive strategies to protect modern web applications and networks.',
    what_you_learn: '- Identifying common web vulnerabilities (OWASP Top 10)\n- Utilizing industry-standard scanning and exploitation tools (Nmap, Burp Suite)\n- Understanding cryptography and secure communication protocols\n- Implementing basic secure coding practices to stop attacks\n- Writing professional vulnerability disclosure reports',
    requirements: '- Familiarity with how the internet works (HTTP, TCP/IP)\n- Basic knowledge of operating systems (Windows, Linux)\n- A strong ethical compass and commitment to responsible disclosure',
    duration_weeks: 8,
    difficulty: 'advanced',
    spots_total: 40,
    spots_filled: 15,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'OSINT Investigation', description: 'Gather publicly available information on a practice target organization to identify potential attack vectors.', week_number: 2 },
      { title: 'Vulnerable App Penetration Test', description: 'Exploit a deliberately vulnerable web application and document the steps required to achieve remote code execution.', week_number: 5 },
      { title: 'Defensive Hardening Strategy', description: 'Draft a mitigation plan detailing how to secure the previously exploited application using secure configurations and firewalls.', week_number: 8 }
    ]
  },
  {
    title: 'Financial Analysis for Startups',
    category: 'operations',
    description: 'Learn the core principles of corporate finance specifically tailored for the fast-paced environment of early-stage startups. This program covers budgeting, forecasting, valuation, and unit economics.',
    what_you_learn: '- Reading and analyzing P&L, balance sheets, and cash flow statements\n- Forecasting revenue models for SaaS and marketplace businesses\n- Calculating critical startup metrics like CAC, LTV, and burn rate\n- Understanding venture capital funding mechanisms and cap tables\n- Preparing robust financial models in Excel',
    requirements: '- Comfort with numbers and basic algebra\n- Advanced proficiency in Microsoft Excel or Google Sheets\n- Interest in entrepreneurship and business strategy',
    duration_weeks: 6,
    difficulty: 'intermediate',
    spots_total: 60,
    spots_filled: 22,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'Historical Financial Analysis', description: 'Analyze the past financials of a public tech company and identify key trends affecting its growth.', week_number: 2 },
      { title: 'SaaS Revenue Forecast', description: 'Build a bottom-up 3-year revenue projection model for a B2B software startup based on growth assumptions.', week_number: 4 },
      { title: 'Cap Table Modeling', description: 'Draft a cap table scenario showing equity dilution across Seed and Series A funding rounds.', week_number: 6 }
    ]
  },
  {
    title: 'Frontend Web Development Fundamentals',
    category: 'engineering',
    description: 'Kickstart your tech career by mastering the foundational blocks of the web: HTML, CSS, and JavaScript. Learn to build beautiful, responsive, and accessible websites from scratch.',
    what_you_learn: '- Structuring semantic web documents with HTML5\n- Styling beautiful layouts using CSS3, Flexbox, and Grid\n- Adding dynamic interactivity with vanilla JavaScript and the DOM API\n- Implementing responsive design principles for mobile-friendly sites\n- Version controlling your code with Git and GitHub',
    requirements: '- No prior coding experience necessary\n- A desire to learn and build things\n- A modern web browser and simple text editor',
    duration_weeks: 6,
    difficulty: 'beginner',
    spots_total: 100,
    spots_filled: 98,
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    projects: [
      { title: 'HTML/CSS Landing Page', description: 'Code a pixel-perfect, responsive marketing landing page from a provided design mockup.', week_number: 2 },
      { title: 'Interactive Quiz App', description: 'Build a dynamic quiz application utilizing JavaScript logic, timing events, and local storage.', week_number: 4 },
      { title: 'API Weather Dashboard', description: 'Create an asynchronous web app that fetches and displays live data from a third-party weather API.', week_number: 6 }
    ]
  }
];

async function seed() {
  console.log("Starting seeding process...");
  
  for (const internship of internshipsData) {
    const slug = generateSlug(internship.title);
    console.log(`Processing: ${internship.title}`);
    
    // Check if exists
    const { data: existingData } = await supabase
      .from('internships')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    let internshipId;

    if (existingData) {
      console.log(`- Already exists, updating...`);
      internshipId = existingData.id;
      
      const { projects, ...updateData } = internship;
      
      const { error: updateError } = await supabase
        .from('internships')
        .update(updateData)
        .eq('id', internshipId);
        
      if (updateError) {
        console.error("Error updating internship:", updateError);
        continue;
      }
    } else {
      console.log(`- Creating new internship...`);
      const { projects, ...insertData } = internship;
      
      const { data: newData, error: insertError } = await supabase
        .from('internships')
        .insert({
          ...insertData,
          slug
        })
        .select()
        .single();
        
      if (insertError) {
        console.error("Error inserting internship:", insertError);
        continue;
      }
      
      internshipId = newData.id;
    }
    
    // Process projects
    console.log(`- Processing ${internship.projects.length} projects...`);
    
    // Clear existing projects to avoid duplicates if re-running
    await supabase.from('internship_projects').delete().eq('internship_id', internshipId);
    
    const projectsToInsert = internship.projects.map((p, index) => ({
      internship_id: internshipId,
      title: p.title,
      description: p.description,
      week_number: p.week_number,
      order_index: index,
      resources_url: null
    }));
    
    const { error: projectError } = await supabase
      .from('internship_projects')
      .insert(projectsToInsert);
      
    if (projectError) {
      console.error("Error inserting projects:", projectError);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
