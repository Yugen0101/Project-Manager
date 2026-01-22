// User roles
export const ROLES = {
    ADMIN: 'admin',
    ASSOCIATE: 'associate',
    MEMBER: 'member',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    [ROLES.ADMIN]: 3,
    [ROLES.ASSOCIATE]: 2,
    [ROLES.MEMBER]: 1,
};

// Check if user has required role or higher
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Check if user is admin
export function isAdmin(userRole: UserRole): boolean {
    return userRole === ROLES.ADMIN;
}

// Check if user is associate or higher
export function isAssociateOrHigher(userRole: UserRole): boolean {
    return hasRole(userRole, ROLES.ASSOCIATE);
}

// Route permissions
export const ROUTE_PERMISSIONS: Record<string, UserRole> = {
    '/admin': ROLES.ADMIN,
    '/associate': ROLES.ASSOCIATE,
    '/member': ROLES.MEMBER,
};

// Get minimum required role for a route
export function getRequiredRole(pathname: string): UserRole | null {
    for (const [route, role] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pathname.startsWith(route)) {
            return role;
        }
    }
    return null;
}
