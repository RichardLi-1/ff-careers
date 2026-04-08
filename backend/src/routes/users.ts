import app from '../app'
import { getAllUsersController, getUserByIdController, updateUserByIdController, deleteUserByIdController } from '../controllers/users'

app.get('/users', getAllUsersController) //ADMIN ONLY

app.get('/users/:id', getUserByIdController) //ADMIN OR USER THEMSELVES

app.patch('/users/:id', updateUserByIdController) //ADMIN OR USER THEMSELVES

app.delete('/users/:id', deleteUserByIdController) //mark account inactive, or deactivate. IDs should match Firebase UID