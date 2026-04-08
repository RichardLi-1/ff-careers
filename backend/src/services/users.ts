
import 'dotenv/config';
import { QueryResult } from 'pg';
import pool from '../db'


export async function getAllUsers() {
    pool.query('SELECT * FROM users', (err: Error | undefined, res: QueryResult) => {
        if (err) {
            console.error('Error executing query', err.stack);
        }
        else {
            console.log('Users:', res.rows);
        }
    });
}

export async function getUserById(id: string) {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err: Error | undefined, res: QueryResult) => {
        if (err) {
            console.error('Error executing query', err.stack);
        }
        else {
            if (res.rows.length === 0) {
                console.log('No user found with id:', id);
                return false;
            }
            else if (res.rows.length > 1) {
                console.error('Multiple users found with id:', id);
                throw new Error('Data integrity error: multiple users with same id');
            }
            else{
                console.log('User:', res.rows[0]);
                return res.rows[0];
            }
        }
    });
    return false;
}

export async function updateUserById(id: string, userData: any) {
    //validate and sanitize userData before using it in the query
    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [userData.name, userData.email, id], (err: Error | undefined, res: QueryResult) => {
        if (err) {
            console.error('Error executing query', err.stack);
        }
        else {
            console.log('User updated successfully');
            if (res.rowCount) {return res.rowCount > 0 ;} else return false;
        }
    });
    return false;
}

export async function deleteUserById(id: string) {
    pool.query('DELETE FROM users WHERE id = $1', [id], (err: Error | undefined, res: QueryResult) => {
        if (err) {
            console.error('Error executing query', err.stack);
        }
        else {
            console.log('User deleted successfully');
            if (res.rowCount) {return res.rowCount > 0 ;} else return false;
        }
    });
    return false;
}