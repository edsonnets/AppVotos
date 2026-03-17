import { NextResponse } from 'next/server';
import { generateToken, serializeCookie } from '@/lib/auth';
// Importa bcryptjs para comparar contraseñas (necesitarías una base de datos real)
// import bcrypt from 'bcryptjs'; 

export async function POST(request: Request) {
    const { username, password } = await request.json();

  // 1. Verificar credenciales (usar base de datos real aquí)
  // const user = await db.user.findUnique({ where: { username } });
  // if (!user || !await bcrypt.compare(password, user.passwordHash)) { ... }
    if (username !== 'testuser' || password !== 'password123') { // Ejemplo simple
        return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

  // 2. Generar token JWT
    const token = generateToken(username);

  // 3. Devolver el token en una cookie HttpOnly
    const response = NextResponse.json({ message: 'Inicio de sesión exitoso' });
  // Usar set-cookie header directamente en NextResponse para App Router
    //response.headers.set('Set-Cookie', serializeCookie(token, {})); // Implementación simplificada

    return response;
}
