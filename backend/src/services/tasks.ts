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

export async function createTask(uid: string, title: string, description: string){
    try {
        const res = await pool.query("INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *", [uid, title, description, "in_progress"]);
        return res.rows[0];
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateTaskById(taskId: string, taskData: any){
    //sanitize
    try {
        const res = await pool.query("UPDATE tasks SET title = $1, description = $2 WHERE id=$3", [taskData.title, taskData.description, taskId]);
        return res.rowCount === 1;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteTaskById(taskId: string){
    try {
        const res = await pool.query("DELETE FROM tasks WHERE id=$1", [taskId]);
        if (res.rowCount === 1) {
            return true;
        }
        return false;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
    
}


export async function createTaskRating(taskId: string, question: string, rating: number, review_response: string){
    try {
        const res = await pool.query(
            "UPDATE tasks SET rating = $1, question = $2, review_response = $3 WHERE id = $4 RETURNING *",
            [rating, question, review_response, taskId]); 
        return res.rows[0];
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}