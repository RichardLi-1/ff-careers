import app from '../app'
import { getAllUsersController, getUserByIdController, upsertUserController, updateUserByIdController, deleteUserByIdController } from '../controllers/users'
import { requireAuth } from '../middleware/auth';

app.get('/users', getAllUsersController) //ADMIN ONLY

app.get('/users/:uid', getUserByIdController) //ADMIN OR USER THEMSELVES

app.post('/users/me', requireAuth, upsertUserController)

app.patch('/users/:uid', updateUserByIdController) //ADMIN OR USER THEMSELVES

app.delete('/users/:uid', deleteUserByIdController) //mark account inactive, or deactivate. IDs should match Firebase UID