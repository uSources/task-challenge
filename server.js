import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { db } from './db.js';
import { between } from './utils.js';

const EXPIRATION_MS = 86400000;
const TICK_INTERVAL = 1000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.json([...db.values()]);
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const task = db.get(id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/:id/execute', (req, res) => {
  const id = req.params.id;
  const task = db.get(id);

  if (task) {
    task.status = 2;
    task.lastTick = new Date();
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/:id/pause', (req, res) => {
  const id = req.params.id;
  const task = db.get(id);

  if (task) {
    task.status = 1;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/', (req, res) => {
  const x = req.body.x || 0;
  const y = req.body.y || 0;
  const id = between(1, 100000);

  const task = {
    id: id,
    x,
    y,
    lastTick: null,
    progress: 0,
    status: 0,
  };

  db.set(`${id}`, task);

  res.json(task);
});

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.json({ status: 'DONE', message: `Task with id: #${id} deleted` });
});

app.listen(process.env.PORT, () => {
  console.log('Server is running');
});

//A tick
setInterval(() => {
  db.forEach((task, key) => {
    if (task.status === 2) {
      const elapsedTime = new Date().getTime() - task.lastTick.getTime();
      task.lastTick = new Date();

      const waitTime = task.y - task.x;

      console.log(
        `Tick for task #${key}, wait: ${waitTime}, progress: ${task.progress}, elapsedTimePreTick: ${elapsedTime}`
      );

      task.progress += elapsedTime;

      if (task.progress >= waitTime) {
        console.log(`Task #${key} is done`);
        db.delete(key);
      }
    }
  });
}, TICK_INTERVAL);

//Delete old tasks
setInterval(() => {
  db.forEach((value, key) => {
    if (task.status !== 2) {
      const elapsedTime = new Date().getTime() - value.createdAt.getTime();
      if (elapsedTime >= EXPIRATION_MS) {
        console.log(`Task #${key} expired!`);
        db.delete(key);
      }
    }
  });
}, EXPIRATION_MS);
