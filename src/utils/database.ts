import { Pool } from 'pg';

export interface IDBSetting {
    host: string
    port: number
    user: string
    password: string
    database: string
}

let conn: Pool;

//if (!conn) {
    // eslint-disable-next-line prefer-const
    conn = new Pool({
        user: "postgres",
        password: "ADMIN",
        host: "127.0.0.1",
        port: 5432,
        database: "db_elections"
    });
//}

export { conn }

// export const GetDBSettings = () => {
//     return new Pool({
//         host: "127.0.0.1",
//         port: 5432,
//         user: "postgres",
//         password: "ADMIN",
//         database: "db_elections"
//     })
// }
