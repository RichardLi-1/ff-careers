import app from '../app'
import { getAllTasksByUserIdController, createTaskController, updateTaskByIdController, deleteTaskByIdController } from '../controllers/tasks'

app.get('/users/:userId/:tasks', getAllTasksByUserIdController) //ADMIN ONLY

app.post('/users:userId/:tasks', createTaskController) //ADMIN OR USER THEMSELVES

app.patch('/tasks/:taskid/', updateTaskByIdController) //ADMIN OR USER THEMSELVES

app.delete('/tasks/:taskid', deleteTaskByIdController)