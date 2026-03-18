import { NextResponse } from 'next/server';
import { conn } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // 1. Buscar usuario por email
        const result = await conn.query(
            'SELECT * FROM "users" WHERE email = $1 AND is_active = true', 
            [email]
        );
        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }

        // 2. Validar Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
        }


        // 3. Generar JWT usando 'jose'
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ 
            id: user.id, 
            email: user.email, 
            name: user.name 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h') // Expiración de 1 hora
            .sign(secret);

        // 4. Actualizar datos de login en la DB
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        await conn.query(
            'UPDATE "users" SET last_login_ip = $1, last_login_at = NOW() WHERE id = $2',
            [ip, user.id]
        );

        // Obtenemos nro de mesa asignado
        const tableQuery = await conn.query(
            `SELECT VT.id AS table_id, VT.internal_code, IT.id AS institution_id, IT.code, IT.name
            FROM voting_tables VT
            INNER JOIN institutions IT ON IT.id = VT.institution_id
            WHERE VT.internal_code = $1`, 
            [user.phone]
        );

        const userTable = tableQuery.rows[0];

        // 5. Crear respuesta y setear Cookie HttpOnly
        const response = NextResponse.json({
            success: true,
            user: { userId: user.id, name: user.name, email: user.email, idTable: userTable.table_id, numTable: userTable.internal_code, cod_institution: userTable.institution_id, institution: userTable.name }
        });

        //const isProduction = process.env.NODE_ENV === 'production';


        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true, // No accesible por JS
            secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
            sameSite: 'lax',
            maxAge: 3600, // 1 hora en segundos
            path: '/',
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
    }
}