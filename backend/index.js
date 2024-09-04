import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { router } from './routes/index.js';

import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

const app = express();


// Apply CORS middleware
app.use(cors({
    // origin: '*',
    // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT, "Frontend URL: " + process.env.FRONTEND_URL);
    });
}).catch(err => {
    console.error("Failed to connect to DB", err);
});
