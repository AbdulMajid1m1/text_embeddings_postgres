

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import RootRoute from './routes/RootRoute.js';
import { closeAllPGVectorStores } from "./utils/pgvectorStoreManager.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();


const allowedOrigins = [
    "http://localhost:3080",
    "http://gs1ksa.org:3080",

];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api', RootRoute);



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).send(errorMessage);
});


// Server listening on port 3077
const PORT = 3077;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



process.on('SIGINT', async () => {
    await closeAllPGVectorStores();
    console.log('All PGVectorStores closed');
    process.exit(0);
});