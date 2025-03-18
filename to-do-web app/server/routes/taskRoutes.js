import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', TaskSchema);

router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        console.log(`Updating task with ID: ${req.params.id}`); 
        const task = await Task.findById(req.params.id); 
        console.log(`Task found: ${task}`);

        if (!task) {
            console.log('Task not found'); 
            return res.status(404).send('Task not found');
        }

        Object.assign(task, req.body); 
        await task.save(); 
        res.send(task);
    } catch (err) {
        console.error('Error updating task:', err); 
        res.status(400).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            console.log('Task not found'); 
            return res.status(404).send('Task not found');
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
