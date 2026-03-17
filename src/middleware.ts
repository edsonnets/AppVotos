import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    // Si intenta acceder a rutas de API protegidas (votos, candidatos) sin token
    if (request.nextUrl.pathname.startsWith('/api/votes') || 
        request.nextUrl.pathname.startsWith('/api/candidates')) {
        
        if (!token) {
            return NextResponse.json(
                { message: 'No autorizado. Token faltante.' }, 
                { status: 401 }
            );
        }

        
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return NextResponse.json(
                { message: 'Token inválido o expirado.' }, 
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}
        // '/api/votes/:path*',
        // '/api/candidates/:path*',
// Configuración de las rutas que el middleware debe vigilar
export const config = {
    matcher: [],
};