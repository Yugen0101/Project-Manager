import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getRequiredRole, hasRole } from '@/lib/auth/roles';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 1. Get user and metadata
    const { data: { user }, error } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // Public routes - Bypass authentication
    if (pathname === '/' || pathname === '/login' || pathname === '/team/login' || pathname === '/auth/callback') {
        return response;
    }

    // Redirect to login if not authenticated
    if (error || !user) {
        if (pathname.startsWith('/team')) {
            return NextResponse.redirect(new URL('/team/login', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. High-Speed Role Check via Metadata
    // Leverage natively cached Auth Metadata to avoid per-request DB calls.
    const metadata = user.user_metadata || {};
    const userRole = metadata.role || 'member';
    const isActive = metadata.is_active !== undefined ? metadata.is_active : true;

    // Reject inactive users immediately (Fast path)
    if (isActive === false) {
        console.log('Middleware - Blocking inactive operator:', user.id);
        return NextResponse.redirect(new URL('/login?error=inactive', request.url));
    }

    // 3. Permission Matrix Validation
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole && !hasRole(userRole, requiredRole)) {
        // Redirect to appropriate dashboard based on role to prevent "void" access
        let redirectUrl = '/login';
        if (userRole === 'admin') redirectUrl = '/admin/dashboard';
        else if (userRole === 'associate') redirectUrl = '/associate/dashboard';
        else if (userRole === 'member' || userRole === 'team_member') redirectUrl = '/member/dashboard';

        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // 4. Admin Feature Restrictions
    if ((pathname === '/projects/create' || pathname === '/analytics') && userRole !== 'admin') {
        const fallbackUrl = (userRole === 'member' || userRole === 'team_member') ? '/member/dashboard' : '/associate/dashboard';
        return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
