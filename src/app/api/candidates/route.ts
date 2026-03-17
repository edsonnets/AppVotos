import { NextResponse } from 'next/server';
// Importa tu configuración de base de datos aquí
import { conn } from '@/lib/db'; 

export async function GET() {
    try {
        const sql = "SELECT * FROM candidates";
        
        // Ejecutamos la consulta
        const response = await conn.query(sql);

        console.log(response.rows);

        // En el App Router, simplemente retornamos NextResponse
        return NextResponse.json({
            success: true,
            count: response.rows.length,
            data: response.rows
        }, { status: 200 });

    } catch (error) {
        console.error("Error de base de datos:", error);

        return NextResponse.json({
            success: false,
            message: "Error al obtener los candidatos",
            // Solo mostrar el error real en desarrollo
            error: process.env.NODE_ENV === 'development' ? error : "Internal Server Error"

        }, { status: 500 });
    }
}