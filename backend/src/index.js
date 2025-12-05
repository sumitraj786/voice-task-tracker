require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();   // <-- This will now work normally
app.set('prisma', prisma);

// Routes
const voiceRouter = require('./routes/voice');
const taskRouter = require('./routes/tasks');

app.use('/api/tasks', taskRouter);
app.use('/api/voice', voiceRouter);

const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
