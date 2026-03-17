// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        // Redirigir al login si no hay token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        // Redirigir al login si el token es inválido/expirado
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si es válido, continuar con la petición
    return NextResponse.next();
}

// Configurar qué rutas proteger
export const config = {
    matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
