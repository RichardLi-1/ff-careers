import app from '../app'
import { getMyTasksController, getAllTasksByUserIdController, createTaskController, updateTaskByIdController, deleteTaskByIdController, createTaskRatingController } from '../controllers/tasks'

import { requireAuth } from '../middleware/auth';

app.get('/tasks/me', requireAuth, getMyTasksController);

app.post('/tasks/me', requireAuth, createTaskController);

app.get('/users/:userId/:tasks', getAllTasksByUserIdController) //ADMIN ONLY

app.post('/users:userId/:tasks', createTaskController) //ADMIN OR USER THEMSELVES

app.patch('/tasks/:taskid/', updateTaskByIdController) //ADMIN OR USER THEMSELVES

app.delete('/tasks/:taskid', deleteTaskByIdController)

app.post('/tasks/:taskid/rating', requireAuth, createTaskRatingController)