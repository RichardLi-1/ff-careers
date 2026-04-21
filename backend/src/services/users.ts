
import 'dotenv/config';
import pool from '../db'


export async function getAllUsers() {
    try {
        const res = await pool.query('SELECT * FROM users')
        if (res.rows.length === 0) {
            console.log('No users found');
            return false;
        }
        console.log('Users:', res.rows);
        return res.rows;
    }
    catch (err) {
        if (err instanceof Error) {console.error('Error executing query', err.stack);}
        else {console.error('Error executing query', err);}
        return false;
    }
}

export async function getUserById(id: string) {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows.length === 0) {
            console.log('No user found with id:', id);
            return false;
        }
        if (res.rows.length > 1) {
            throw new Error('Data integrity error: multiple users with same id');
        }
        console.log('User:', res.rows[0]);
        return res.rows[0];
    }
    catch (err) {
        if (err instanceof Error) { console.error('Error executing query', err.stack); }
        else { console.error('Error executing query', err); }
        return false;
    }
}

export async function updateUserById(id: string, userData: any) {
    try {
        const res = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [userData.name, userData.email, id]);
        console.log('User updated successfully');
        return res.rowCount ? res.rowCount > 0 : false;
    }
    catch (err) {
        if (err instanceof Error) { console.error('Error executing query', err.stack); }
        else { console.error('Error executing query', err); }
        return false;
    }
}

export async function deleteUserById(id: string) {
    try {
        const res = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        console.log('User deleted successfully');
        return res.rowCount ? res.rowCount > 0 : false;
    }
    catch (err) {
        if (err instanceof Error) { console.error('Error executing query', err.stack); }
        else { console.error('Error executing query', err); }
        return false;
    }
}