import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        // mongoose.set('debug', true); 
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
