import app from '../app'

app.get('/', (req, res) => {
    res.send("get")
})


//users

app.get('/users', (req, res) => { //ADMIN ONLY
    res.send("get all users")
})

app.get('/users/:id', (req, res) => {
    res.send("get user info by id")
})

app.patch('/users/:id', (req, res) => {
    res.send("update user info by id")
})

app.delete('/users/:id', (req, res) => { //mark account inactive, or deactivate. IDs should match Firebase UID
    res.send("delete user by id")
})