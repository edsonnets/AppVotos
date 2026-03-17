import { NextResponse } from 'next/server';
import { conn } from '@/lib/db';
import { RegisterVoteRequest } from '@/model';

export async function POST(req: Request) {
    const client = await conn.connect(); // Obtenemos un cliente para la transacción
    
    try {
        const body: RegisterVoteRequest = await req.json();
        const { categoryResult, votesByCandidate } = body;

        await client.query('BEGIN'); // Iniciar transacción

        // 1. Insertar el resumen de la mesa (VotingTableCategoryResult)
        const resQuery = `
            INSERT INTO voting_table_category_results 
            (voting_table_id, election_type_category_id, valid_votes, blank_votes, null_votes, total_votes, is_consistent, status, entered_by, entered_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
        `;
        // await client.query(resQuery, [
        //     categoryResult.voting_table_id,
        //     categoryResult.election_type_category_id,
        //     categoryResult.valid_votes,
        //     categoryResult.blank_votes,
        //     categoryResult.null_votes,
        //     categoryResult.total_votes,
        //     categoryResult.is_consistent,
        //     categoryResult.status,
        //     categoryResult.entered_by
        // ]);

        /************** TODO **************/
        for (const cr of categoryResult) {
            //console.log(`Registrando cabecera por candidato`,v);
            await client.query(resQuery, [
                cr.voting_table_id,
                cr.election_type_category_id,
                cr.valid_votes,
                cr.blank_votes,
                cr.null_votes,
                cr.total_votes,
                cr.is_consistent,
                cr.status,
                cr.entered_by
            ]);
        }

        /********************************/

        // 2. Insertar los votos por candidato
        const voteQuery = `
            INSERT INTO votes 
            (quantity, vote_status, voting_table_id, candidate_id, election_type_id, election_type_category_id, user_id, registered_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        `;

        for (const v of votesByCandidate) {
            //console.log(`Registrando voto para candidato`,v);
            await client.query(voteQuery, [
                v.quantity,
                'pending_review',
                v.voting_table_id,
                v.candidate_id,
                v.election_type_id,
                v.election_type_category_id,
                v.user_id
            ]);
        }

        // 3. Update voting table elections
        const tabQuery = `UPDATE voting_table_elections SET ballots_used = ` + 
        categoryResult[0].total_votes + `, total_voters = ` + categoryResult[0].total_votes +
        ` WHERE voting_table_id = ` + categoryResult[0].voting_table_id + ` AND election_type_id = 2`;

        await client.query(tabQuery);

        await client.query('COMMIT'); // Confirmar cambios

        return NextResponse.json({ success: true, message: "Registro exitoso" }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK'); // Cancelar todo si hay error
        console.error(error);
        return NextResponse.json({ 
            success: false, 
            error: (error as Error).message 
        }, { status: 500 });
    } finally {
        client.release(); // Liberar el cliente de vuelta al pool
    }
}
