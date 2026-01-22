export type AppError = {
    success: false;
    error: string;
    code?: string;
    status?: number;
};

/**
 * Standardized error handler for Server Actions.
 * Masks sensitive database details in production while providing 
 * useful feedback in development.
 */
export function handleActionError(error: any): AppError {
    // Log the actual error for server-side monitoring (could be piped to Axiom/Sentry/etc)
    console.error('[System Error]:', {
        timestamp: new Date().toISOString(),
        message: error?.message,
        code: error?.code,
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined
    });

    const isProduction = process.env.NODE_ENV === 'production';

    // Professional fallback message
    let message = 'The system encountered an unexpected issue. Our team has been notified.';
    let code = 'INTERNAL_SERVER_ERROR';

    if (error?.message) {
        // Handle common Postgres/Supabase error codes
        if (error.code === '23505') {
            message = 'Unique constraint violation: This record already exists.';
            code = 'CONFLICT';
        } else if (error.code === '23503') {
            message = 'Resource dependency error: This item is linked to other records.';
            code = 'FOREIGN_KEY_VIOLATION';
        } else if (error.code === 'PGRST116') {
            message = 'The requested resource was not found.';
            code = 'NOT_FOUND';
        } else if (error.message.includes('Unauthorized') || error.status === 401) {
            message = 'Security violation: Unauthorized access attempt.';
            code = 'UNAUTHORIZED';
        } else if (!isProduction) {
            // Expose detailed errors in development
            message = error.message;
        }
    }

    return {
        success: false,
        error: message,
        code: code,
        status: error?.status || 500
    };
}

/**
 * Standardized success wrapper
 */
export function successResponse<T>(data?: T) {
    return {
        success: true as const,
        data: data ?? null
    };
}
