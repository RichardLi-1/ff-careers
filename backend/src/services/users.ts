
import 'dotenv/config';
import pool from '../db'


export async function getAllUsers() {
    const res = await pool.query('SELECT * FROM users')
    return res.rows.length > 0 ? res.rows : null;
}

export async function getUserById(id: string) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (res.rows.length > 1) {
        throw new Error('Data integrity error: multiple users with same id');
    }
    return res.rows[0] ?? null;
}

export async function upsertUser(firebase_uid: string, name: string, email: string) {
    const res = await pool.query(
        'INSERT INTO users (firebase_uid, name, email) VALUES ($1, $2, $3) ON CONFLICT (firebase_uid) DO NOTHING',
        [firebase_uid, name, email]
    );
    return res.rowCount != null && res.rowCount > 0;
}

export async function updateUserById(id: string, userData: any) {
    const res = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [userData.name, userData.email, id]
    );
    return res.rowCount != null && res.rowCount > 0;
}

export async function deleteUserById(id: string) {
    const res = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return res.rowCount != null && res.rowCount > 0;
}
