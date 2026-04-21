//create express app, middleware, routes

import express, { Express } from 'express';
import 'dotenv/config';

const app: Express = express(); //app is an Express application object
app.use(express.json());

const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5555,  // match SSH tunnel
});


async function testDBConnection() {
    try {
        console.log('Testing database connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', res.rows[0]);
        return true;
    }
    catch (err) {
        console.error('Database connection error:', err);
        return false;
    }
}

testDBConnection().catch(err => {
    console.error('Database connection error:', err);
});


app.get('/health', async (req, res) => {
    const dbIsConnected = await testDBConnection();
    res.send(dbIsConnected ? "ok" : "database connection error");
})


app.get('/', (req, res) => {
    res.send("get")
})


export default app;