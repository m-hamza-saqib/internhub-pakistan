import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://internhub.vercel.app';
  const supabase = await createClient();

  const { data: internships } = await supabase
    .from('internships')
    .select('slug, updated_at')
    .eq('is_published', true);
    // .eq('is_archived', false); // Enable this after running the migration

  const staticPages = [
    { path: '',            priority: 1.0, freq: 'weekly' as const },
    { path: '/internships', priority: 0.9, freq: 'daily' as const },
    { path: '/about',      priority: 0.7, freq: 'monthly' as const },
    { path: '/faq',        priority: 0.7, freq: 'monthly' as const },
    { path: '/contact',    priority: 0.6, freq: 'monthly' as const },
  ];

  return [
    ...staticPages.map(({ path, priority, freq }) => ({
      url: `${appUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    })),
    ...(internships as any[] || []).map((i) => ({
      url: `${appUrl}/internships/${i.slug}`,
      lastModified: new Date(i.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
