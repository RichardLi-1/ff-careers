import app from './app';
import './routes/tasks';
import './routes/users';
import 'dotenv/config';
//rest apis—what things exist in my system?
//users
//jobs
//tasks
//ratings and reviews

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

