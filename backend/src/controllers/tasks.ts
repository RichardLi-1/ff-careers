import app from '../app'

import { getAllTasksByUserId, createTask, updateTaskById, deleteTaskById, createTaskRating} from '../services/tasks'

export async function getMyTasksController(req: any, res: any) {
    try {
        const tasks = await getAllTasksByUserId(req.user.uid);
        res.status(200).json(tasks);
    }
    catch {
        console.log('Error getting my tasks');
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getAllTasksByUserIdController(req: any, res: any) {
    try {
        const tasks = await getAllTasksByUserId(req.params.id);
        res.status(200).json(tasks);
    }
    catch {
        console.log('Error getting all tasks by user id');
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createTaskController(req: any, res: any) {
    const userId = req.user.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const success = await createTask(userId, req.body.title, req.body.description);
        if(success){
            res.status(200).json(success);
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateTaskByIdController(req: any, res: any) {
    try {
        const success = await updateTaskById(req.params.id, req.body);
        if (success){
            res.status(200).json({ message: 'Task updated successfully' });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteTaskByIdController(req: any, res: any) {
    try {
        const success = await deleteTaskById(req.params.id);
        if (success){
            res.status(200).json({ message: 'Task deleted successfully' });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createTaskRatingController(req: any, res: any) {
    try {
        const success = await createTaskRating(req.params.id, req.body.question, req.body.rating, req.body.review_response);
        if (success){
            res.status(200).json({ message: 'Task rating created successfully' });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
}