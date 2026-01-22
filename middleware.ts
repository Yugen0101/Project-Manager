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

    // Refresh session if expired
    const { data: { user }, error } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Public routes
    if (pathname === '/' || pathname === '/login' || pathname === '/auth/callback') {
        return response;
    }

    // Redirect to login if not authenticated
    if (error || !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Use service role client to get user data (bypass RLS)
    const adminClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // No-op for service role
                },
            },
        }
    );

    const { data: userData, error: userError } = await adminClient
        .from('users')
        .select('role, is_active')
        .eq('id', user.id)
        .single();

    // Log for debugging
    console.log('Middleware - User ID:', user.id);
    console.log('Middleware - User data:', userData);
    console.log('Middleware - User error:', userError);

    // Check if user profile exists
    if (userError || !userData) {
        console.error('Middleware - User profile not found or error:', userError);
        return NextResponse.redirect(new URL('/login?error=profile_not_found', request.url));
    }

    // Check if user is active (explicitly check for false, not just falsy)
    if (userData.is_active === false) {
        console.log('Middleware - User is inactive');
        return NextResponse.redirect(new URL('/login?error=inactive', request.url));
    }

    // Check role-based access
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole && !hasRole(userData.role, requiredRole)) {
        // Redirect to appropriate dashboard based on role
        if (userData.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (userData.role === 'associate') {
            return NextResponse.redirect(new URL('/associate/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/member/dashboard', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
