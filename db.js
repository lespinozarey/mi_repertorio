import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: 'asdasd',
    host: 'localhost',
    port: 5432,
    database: 'repertorio',
    idleTimeoutMillis: 1000
});

export default pool; 