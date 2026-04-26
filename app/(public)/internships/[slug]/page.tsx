import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import InternshipDetailClient from './InternshipDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('internships')
    .select('title, description, category, difficulty, duration_weeks, thumbnail_url')
    .eq('slug', slug)
    .single() as any;

  if (!data) return { title: 'Internship Not Found' };

  return {
    title: `${data.title} Internship`,
    description: `Apply for ${data.title} remote internship. ${data.duration_weeks} weeks, ${data.difficulty} level. Get certified. Pakistani students welcome.`,
    openGraph: {
      title: `${data.title} — AWH TECH`,
      description: data.description.slice(0, 160),
      images: data.thumbnail_url ? [data.thumbnail_url] : [],
      locale: 'en_PK',
    },
  };
}

export default async function InternshipDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: internship } = await supabase
    .from('internships')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as any;

  if (!internship) notFound();

  const { data: projects } = await supabase
    .from('internship_projects')
    .select('id, title, week_number, order_index')
    .eq('internship_id', internship.id)
    .order('order_index');

  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  let hasApplied = false;
  let applicationStatus: string | null = null;

  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('internship_id', internship.id)
      .eq('is_completed', false)
      .maybeSingle() as any;

    isEnrolled = !!enrollment;

    const { data: application } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', user.id)
      .eq('internship_id', internship.id)
      .maybeSingle() as any;

    hasApplied = !!application;
    applicationStatus = application?.status ?? null;
  }

  return (
    <InternshipDetailClient
      internship={internship}
      projects={projects || []}
      isLoggedIn={!!user}
      isEnrolled={isEnrolled}
      hasApplied={hasApplied}
      applicationStatus={applicationStatus}
    />
  );
}
