const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const prisma = req.app.get('prisma');
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const prisma = req.app.get('prisma');
  const { title, description, status, priority, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = await prisma.task.create({
    data: { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null }
  });
  res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
  try {
    const prisma = req.app.get("prisma");
    const id = Number(req.params.id);
    const { title, description, status, priority, dueDate } = req.body;

    let normalizedDate = undefined;

    if (dueDate && dueDate.trim() !== "") {
      if (dueDate.length === 16) {
        normalizedDate = new Date(dueDate + ":00.000Z");
      } else {
        normalizedDate = new Date(dueDate);
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        status: status || undefined,
        priority: priority || undefined,
        dueDate: normalizedDate,
      },
    });

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err); // 🟢 Now inside catch
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete('/:id', async (req, res) => {
  const prisma = req.app.get('prisma');
  const id = Number(req.params.id);
  await prisma.task.delete({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
