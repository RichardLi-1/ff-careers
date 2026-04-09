import pool from '../db'

export async function getAllTasksByUserId(id: string){
    try {
        const res = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [id]);
        return res.rows;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function createTask(id: string, taskData: any){
    try {
        const res = await pool.query("INSERT INTO tasks (user_id, title, description, status, created_at) VALUES ($1, $2, $3, NOW())", [id, taskData.title, taskData.description, taskData.status, taskData.created_at]);
        return res.rowCount === 1;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateTaskById(taskId: string, taskData: any){
    //sanitize
    try {
        const res = await pool.query("UPDATE tasks SET name = $1, description = $2 WHERE id=$3", [taskData.title, taskData.description, taskId]);
        return res.rowCount === 1;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteTaskById(taskId: string){
    const res = await pool.query("DELETE FROM tasks WHERE id=$1", [taskId]);
    if (res.rowCount === 1) {
        return true;
    }
    return false;
}