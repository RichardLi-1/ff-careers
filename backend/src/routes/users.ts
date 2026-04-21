import app from '../app'
import { getAllUsersController, getUserByIdController, updateUserByIdController, deleteUserByIdController } from '../controllers/users'

app.get('/users', getAllUsersController) //ADMIN ONLY

app.get('/users/:uid', getUserByIdController) //ADMIN OR USER THEMSELVES

app.patch('/users/:uid', updateUserByIdController) //ADMIN OR USER THEMSELVES

app.delete('/users/:uid', deleteUserByIdController) //mark account inactive, or deactivate. IDs should match Firebase UID