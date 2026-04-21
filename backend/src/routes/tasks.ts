import app from '../app'
import { getMyTasksController, getAllTasksByUserIdController, createTaskController, updateTaskByIdController, deleteTaskByIdController } from '../controllers/tasks'

import { requireAuth } from '../middleware/auth';

app.get('/tasks/me', requireAuth, getMyTasksController);

app.get('/users/:userId/:tasks', getAllTasksByUserIdController) //ADMIN ONLY

app.post('/users:userId/:tasks', createTaskController) //ADMIN OR USER THEMSELVES

app.patch('/tasks/:taskid/', updateTaskByIdController) //ADMIN OR USER THEMSELVES

app.delete('/tasks/:taskid', deleteTaskByIdController)