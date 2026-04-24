import { Users, FileText, Briefcase, Award } from 'lucide-react';
export const APP_NAME = 'AHWTECHNOLOGIES';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_DESCRIPTION =
  'Pakistan\'s premier remote internship platform by AHWTECHNOLOGIES. Apply, learn, and grow your career — all from home.';

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
  pending:      { label: 'Pending',      color: 'bg-yellow-100 text-yellow-800' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  accepted:     { label: 'Accepted',     color: 'bg-green-100 text-green-800' },
  rejected:     { label: 'Rejected',     color: 'bg-red-100 text-red-800' },
};

export const PROJECT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started:  { label: 'Not Started',     color: 'bg-gray-100 text-gray-700' },
  in_progress:  { label: 'In Progress',     color: 'bg-blue-100 text-blue-700' },
  pending:      { label: 'Submitted',       color: 'bg-purple-100 text-purple-700' },
  submitted:    { label: 'Submitted',       color: 'bg-purple-100 text-purple-700' },
  under_review: { label: 'Under Review',    color: 'bg-yellow-100 text-yellow-700' },
  passed:       { label: 'Passed ✓',        color: 'bg-green-100 text-green-700' },
  failed:       { label: 'Resubmit',        color: 'bg-red-100 text-red-700' },
};

export const TRUSTED_UNIVERSITIES = [
  'NUST', 'FAST-NUCES', 'LUMS', 'UET Lahore', 'IBA Karachi',
  'COMSATS', 'Air University', 'GIK Institute', 'UCP', 'Bahria University',
];

export const FAQ_ITEMS = [
  {
    q: 'Is this a free internship?',
    a: 'Yes, our internships are 100% free with no tuition or hidden charges. We only charge a one-time PKR 300 community fee to maintain the platform and offer verified certificates.',
  },
  {
    q: 'Is there a separate fee for certificates?',
    a: 'No. The PKR 300 community fee is the only payment you will ever make. It covers your enrollment, full dashboard access for life, and your verified certificate upon completion.',
  },
  {
    q: 'Can I do multiple internships at once?',
    a: 'No. You can only be enrolled in one internship at a time. Once you complete and get certified, you can apply for another.',
  },
  {
    q: 'How long are the internships?',
    a: 'We offer 4-week, 6-week, and 8-week remote internship programs.',
  },
  {
    q: 'Is the certificate internationally recognized?',
    a: 'Yes. Our certificates have a unique QR-verified ID and are recognized by employers globally. They are also shareable directly to LinkedIn.',
  },
  {
    q: 'How do I pay using JazzCash or EasyPaisa?',
    a: 'When you apply, you will be shown payment instructions for EasyPaisa, JazzCash, and Bank Transfer. Simply pay PKR 300 and upload the proof (screenshot).',
  },
  {
    q: 'What happens if my application is rejected?',
    a: 'You will receive an email with feedback. You can reapply to the same internship after a 30-day cooling period.',
  },
  {
    q: 'How long does application review take?',
    a: 'Our admin team reviews applications and payment proofs within 2–5 business days.',
  },
  {
    q: 'Can I do this internship while studying?',
    a: 'Absolutely! Our internships are 100% remote and flexible. You choose your working hours.',
  },
  {
    q: 'What is the minimum profile completeness to apply?',
    a: 'Your profile must be at least 70% complete before you can apply. This ensures we can verify your credentials.',
  },
  {
    q: 'How is my certificate verified?',
    a: 'Each certificate has a unique ID and QR code. Scanning the QR or visiting /verify/[certificate-id] shows the verified certificate details publicly.',
  },
];

export const TESTIMONIALS = [
  { name: 'Ayesha Raza',    role: 'Web Dev Intern',        city: 'Lahore',    uni: 'COMSATS',    rating: 5, text: 'AHWTECHNOLOGIES gave me my first real industry experience. Got hired at a startup within a month of completing my internship!' },
  { name: 'Zain ul Abideen', role: 'Data Science Intern',  city: 'Karachi',   uni: 'IBA',        rating: 5, text: 'The projects were challenging and realistic. The certificate is beautifully designed and verified publicly.' },
  { name: 'Fatima Malik',   role: 'UI/UX Design Intern',    city: 'Islamabad', uni: 'NUST',       rating: 5, text: 'As a student, this was perfect. The feedback from admins was super helpful. 100% recommend!' },
  { name: 'Ahmed Siddiqui', role: 'Digital Marketing Intern',city: 'Peshawar', uni: 'UET',        rating: 5, text: 'Easiest application process ever. Got my offer letter within 3 days and completed the internship remotely while studying.' },
  { name: 'Sara Khan',      role: 'Content Writing Intern', city: 'Multan',    uni: 'BZU',        rating: 5, text: 'The platform is clean and user-friendly. My LinkedIn now shows a verified certificate which has gotten me many interviews.' },
];

export const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Register free, complete your profile with your education and skills.', icon: Users },
  { num: '02', title: 'Apply & Pay', desc: 'Choose an internship and pay a one-time PKR 300 community fee.', icon: FileText },
  { num: '03', title: 'Complete Projects', desc: 'Get lifetime access, receive real-world projects, and submit weekly.', icon: Briefcase },
  { num: '04', title: 'Get Certified', desc: 'Once all projects are approved, download your verified certificate for free.', icon: Award },
];

