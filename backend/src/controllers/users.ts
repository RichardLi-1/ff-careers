import { getAllUsers, getUserById, upsertUser, updateUserById, deleteUserById } from '../services/users';

export async function getAllUsersController(req: any, res: any){
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getUserByIdController(req: any, res: any){
    const firebase_uid = req.params.id;
    try { 
        const user = await getUserById(firebase_uid)
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error getting user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function upsertUserController(req: any, res: any){
    const firebase_uid = req.user.uid;
    try {
        const success = await upsertUser(firebase_uid, req.body.name, req.body.email);
        if (success) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error updating user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateUserByIdController(req: any, res: any){
    const firebase_uid = req.params.id;
    const userData = req.body;
    try {
        const success = await updateUserById(firebase_uid, userData);
        if (success) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error updating user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteUserByIdController(req: any, res: any){
    const firebase_uid = req.params.id;
    try {
        const success = await deleteUserById(firebase_uid);
        if (success) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error deleting user by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}