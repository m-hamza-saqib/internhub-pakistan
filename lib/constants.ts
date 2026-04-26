import { Users, FileText, Briefcase, Award } from 'lucide-react';
export const APP_NAME = 'AWH TECH';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_DESCRIPTION =
  'Building solutions delivering excellence with AWH TECH. Pakistan\'s premier remote internship platform. Apply, learn, and grow your career — all from home.';

export const INTERNSHIP_CATEGORIES = [
  { id: 'software-development', label: 'Software Development', icon: '💻', color: 'bg-blue-100 text-blue-700' },
  { id: 'ui-ux-design',         label: 'UI/UX Design',         icon: '🎨', color: 'bg-purple-100 text-purple-700' },
  { id: 'digital-marketing',    label: 'Digital Marketing',    icon: '📢', color: 'bg-orange-100 text-orange-700' },
  { id: 'data-science',         label: 'Data Science',         icon: '📊', color: 'bg-green-100 text-green-700' },
  { id: 'graphic-design',       label: 'Graphic Design',       icon: '🖌️', color: 'bg-pink-100 text-pink-700' },
  { id: 'content-writing',      label: 'Content Writing',      icon: '✍️', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'cybersecurity',        label: 'Cybersecurity',        icon: '🔐', color: 'bg-red-100 text-red-700' },
  { id: 'business-development', label: 'Business Development', icon: '📈', color: 'bg-teal-100 text-teal-700' },
  { id: 'video-editing',        label: 'Video Editing',        icon: '🎬', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'social-media',         label: 'Social Media Mgmt',   icon: '📱', color: 'bg-rose-100 text-rose-700' },
] as const;

export const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Jhang', 'Rahim Yar Khan', 'Gujrat', 'Mardan',
  'Kasur', 'Dera Ghazi Khan', 'Mingora', 'Nawabshah', 'Sahiwal',
  'Mirpur Khas', 'Okara', 'Mandi Bahauddin', 'Abbottabad', 'Muzaffargarh',
  'Other',
];

export const PAKISTANI_PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir',
];

export const SKILLS_LIST = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Python', 'Django', 'FastAPI', 'PHP', 'Laravel',
  'Java', 'Spring Boot', 'C++', 'C#', '.NET',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Canva',
  'SEO', 'Google Ads', 'Facebook Ads', 'Content Writing', 'Copywriting',
  'Data Analysis', 'Machine Learning', 'Power BI', 'Tableau',
  'Cybersecurity', 'Network Administration', 'Linux',
  'Project Management', 'Business Analysis', 'MS Office',
  'Video Editing', 'After Effects', 'Premiere Pro', 'Social Media',
];

export const DURATION_OPTIONS = [
  { value: 4, label: '4 Weeks' },
  { value: 6, label: '6 Weeks' },
  { value: 8, label: '8 Weeks' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner',     label: 'Beginner',     color: 'bg-green-100 text-green-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'advanced',     label: 'Advanced',     color: 'bg-red-100 text-red-700' },
] as const;

export const APPLICATION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:      { label: 'Application Sent', color: 'bg-yellow-100 text-yellow-800' },
  under_review: { label: 'In Review',        color: 'bg-blue-100 text-blue-800' },
  accepted:     { label: 'Selected ✓',       color: 'bg-green-100 text-green-800' },
  rejected:     { label: 'Incomplete',       color: 'bg-red-100 text-red-800' },
};

export const PROJECT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started:  { label: 'Locked',          color: 'bg-gray-100 text-gray-700' },
  in_progress:  { label: 'Active',          color: 'bg-blue-100 text-blue-700' },
  submitted:    { label: 'Awaiting Audit',  color: 'bg-purple-100 text-purple-700' },
  under_review: { label: 'Audit Ongoing',   color: 'bg-yellow-100 text-yellow-700' },
  passed:       { label: 'Verified ✓',      color: 'bg-green-100 text-green-700' },
  failed:       { label: 'Action Needed',   color: 'bg-red-100 text-red-700' },
};

export const TRUSTED_UNIVERSITIES = [
  'NUST', 'FAST-NUCES', 'LUMS', 'UET Lahore', 'IBA Karachi',
  'COMSATS', 'Air University', 'GIK Institute', 'UCP', 'Bahria University',
];

export const FAQ_ITEMS = [
  {
    q: 'What is AWH TECH?',
    a: 'AWH TECH is an innovation hub providing industry-standard remote internships. Our mission is building solutions that deliver excellence by bridging the gap between academia and professional careers.',
  },
  {
    q: 'Is the internship really free?',
    a: 'Yes. The technical training and projects are 100% free. We only charge a one-time PKR 300 community enabler fee to maintain our digital infrastructure and provide lifetime portal proxy.',
  },
  {
    q: 'What is the "Select & Share" process?',
    a: 'Once you are accepted into a track, you receive your official AWH offer letter. To finalize enrollment, we require you to share your achievement on LinkedIn to help grow the technical community.',
  },
  {
    q: 'Will I get a verified certificate?',
    a: 'Absolutely. Every graduate receives a high-fidelity, QR-verified certificate of achievement shareable globally.',
  },
  {
    q: 'How many tracks can I join?',
    a: 'You can contribute to one track at a time to ensure excellence. Once certified, you are welcome to explore another corridor.',
  },
  {
    q: 'Is the dashboard access permanent?',
    a: 'Yes. Your PKR 300 fee unlocks lifetime access to your dashboard, certificates, and portfolio assets.',
  },
];

export const TESTIMONIALS = [
  { name: 'Ayesha Raza',    role: 'Software Engineer',    city: 'Lahore',    uni: 'COMSATS',    rating: 5, text: 'AWH TECH transformed my technical roadmap. Building solutions delivering excellence isn\'t just a slogan; it\'s their culture.' },
  { name: 'Zain ul Abideen', role: 'Full Stack Developer',  city: 'Karachi',   uni: 'IBA',        rating: 5, text: 'The project-based learning at AWH is unmatched. My verified certificate was a high-value asset during my job hunt.' },
  { name: 'Fatima Malik',   role: 'Product Designer',       city: 'Islamabad', uni: 'NUST',       rating: 5, text: 'Clean, professional, and career-focused. AWH TECH is exactly what Pakistani students need to compete globally.' },
];

export const STEPS = [
  { num: '01', title: 'Identity Entry', desc: 'Register your professional identity and complete your technical profile.', icon: Users },
  { num: '02', title: 'AWH Selection', desc: 'Secure your track, share your offer on LinkedIn, and enable your community proxy.', icon: FileText },
  { num: '03', title: 'Build Solutions', desc: 'Get lifetime access to projects and build excellence under professional review.', icon: Briefcase },
  { num: '04', title: 'Unified Credential', desc: 'Receive your industry-verified achievement certificate and professional ranking.', icon: Award },
];
