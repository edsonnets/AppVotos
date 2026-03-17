import { NextResponse } from 'next/server';
import { conn } from '@/lib/db';

export async function GET() {
    try {
        // Query que une Candidatos con la sumatoria de sus votos
        const query = `
            SELECT 
                c.id, c.name, c.party, c.party_logo,
                SUM(v.quantity) as total_votes
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id, c.name, c.party, c.party_logo
            ORDER BY total_votes DESC
        `;
        
        const result = await conn.query(query);

        return NextResponse.json({
            success: true,
            data: result.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
