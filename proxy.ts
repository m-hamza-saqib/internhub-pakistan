import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. FAST PATH: Skip for static assets and images
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Define route groups
  const dashboardRoutes = ['/dashboard', '/applications', '/my-internship', '/projects', '/certificates', '/profile', '/settings'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'];
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = dashboardRoutes.some(r => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

  // If not a protected route, just continue
  if (!isDashboardRoute && !isAuthRoute && !isAdminRoute) {
    return supabaseResponse;
  }

  try {
    // 2. GET USER with timeout protection
    const { data: { user } } = await Promise.race([
      supabase.auth.getUser(),
      new Promise<{ data: { user: null } }>((_, reject) => 
        setTimeout(() => reject(new Error('Auth Timeout')), 8000)
      )
    ]);

    // 3. LOGIC FOR AUTH PAGES (Login/Register)
    if (user && isAuthRoute && !pathname.startsWith('/auth/callback')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!user && (isDashboardRoute || isAdminRoute)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. ROLE & ACCESSIBILITY CHECK
    if (user && (isDashboardRoute || isAdminRoute)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_lifetime_member')
        .eq('id', user.id)
        .maybeSingle();

      // Admin verification
      if (isAdminRoute && profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // SELECTIVE GATING: 
      // All dashbaord pages are now UNLOCKED by default so users can see their selection status.
      // High-value technical assets (/projects, /certificates) still check if the user is an active participant.
      // (The dashboard pages themselves will show a 'Lock' UI if no active enrollment exists).
      
      const premiumRoutes = ['/projects', '/certificates'];
      const isPremiumRoute = premiumRoutes.some(r => pathname.startsWith(r));

      if (isPremiumRoute && profile?.role !== 'admin' && !profile?.is_lifetime_member) {
        // Find if they have ANY active enrollment if lifetime is false
        const { data: activeEnrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (!activeEnrollment) {
          return NextResponse.redirect(new URL('/my-internship', request.url));
        }
      }
    }
  } catch (err: any) {
    console.error('Proxy Error Handle:', err.message);
    if (process.env.NODE_ENV === 'development' && err.message === 'Auth Timeout') {
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
