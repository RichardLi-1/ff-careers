
import 'dotenv/config';


import { Pool, QueryResult } from 'pg';


async function connectToDatabase() {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: 'localhost',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5555,  // match SSH tunnel
    });

    return pool;
}


export async function getAllUsers() {
    const pool = await connectToDatabase();
    pool.query('SELECT * FROM users', (err: Error | undefined, res: QueryResult) => {
        if (err) {
            console.error('Error executing query', err.stack);
        }
        else {
            console.log('Users:', res.rows);
        }
    });
}