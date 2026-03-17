import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

const SECRET = process.env.JWT_SECRET!; //|| 'default_secret';
//const EXPIRES = process.env.JWT_EXPIRES_IN || 3600;

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, SECRET, { expiresIn: '1h' });
};

export const serializeCookie = (token: string, res: NextApiResponse) => {
    const cookie = serialize('authToken', token, {
        httpOnly: true, // Impide el acceso desde JavaScript del lado del cliente
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
        sameSite: 'strict',
        maxAge: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
        path: '/',  
    });
    
    res.setHeader('Set-Cookie', cookie);
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return error;
    }
};
