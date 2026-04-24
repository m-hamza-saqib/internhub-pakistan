import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://internhub.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/internships', '/internships/*', '/about', '/faq', '/contact', '/verify/*'],
        disallow: ['/admin/*', '/dashboard', '/api/*'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
