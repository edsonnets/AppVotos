import { Pool, PoolConfig } from 'pg';

// Configuración de la base de datos
const poolConfig: PoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME,
    max: 10, // Máximo de conexiones simultáneas
    idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
};

declare global {
    var pool: Pool | undefined;
}

// Evitar múltiples instancias del Pool en desarrollo (Hot Reload)
let pool;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool(poolConfig);
} else {
    if (!global.pool) {
        global.pool = new Pool(poolConfig);
    }
    pool = global.pool;
}

export const conn = pool;