require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();

// very important: allow your deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://voice-task-frontend.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// prisma client
const prisma = new PrismaClient();
app.set("prisma", prisma);

// routes
const voiceRouter = require("./routes/voice");
const taskRouter = require("./routes/tasks");

app.use("/api/tasks", taskRouter);
app.use("/api/voice", voiceRouter);

app.get("/", (req, res) => {
  res.send("Backend is running on Render");
});

// very important: Render assigns dynamic PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
