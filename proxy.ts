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

  // Define route types
  const dashboardRoutes = ['/dashboard', '/applications', '/my-internship', '/projects', '/certificates', '/profile', '/settings'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = dashboardRoutes.some(r => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

  // If not a protected route, just continue
  if (!isDashboardRoute && !isAuthRoute && !isAdminRoute) {
    return supabaseResponse;
  }

  try {
    // 2. GET USER with timeout protection
    // We use a promise wrapper to ensure a network hang doesn't block the whole proxy
    const { data: { user } } = await Promise.race([
      supabase.auth.getUser(),
      new Promise<{ data: { user: null } }>((_, reject) => 
        setTimeout(() => reject(new Error('Auth Timeout')), 8000)
      )
    ]);

    // 3. LOGIC FOR AUTH PAGES (Login/Register)
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!user && (isDashboardRoute || isAdminRoute)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. ENROLLMENT & ADMIN CHECK
    if (user && (isDashboardRoute || isAdminRoute)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_lifetime_member, role')
        .eq('id', user.id)
        .single();

      // Admin logic
      if (isAdminRoute && profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Enrollment Lock for Dashboard
      if (isDashboardRoute && profile?.role !== 'admin' && !profile?.is_lifetime_member) {
        if (pathname !== '/enroll') {
          return NextResponse.redirect(new URL('/enroll', request.url));
        }
      }
    }
  } catch (err: any) {
    console.error('Proxy Error Handle:', err.message);
    // If it's a timeout and we're in dev, let the request through to see the actual page error
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
