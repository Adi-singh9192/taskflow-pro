import { Router } from "express";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { Board } from "../models/Board.js";

const router = Router();
router.use(requireAuth);

router.get("/board/:boardId", async (req: AuthRequest, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    const board = await Board.findOne({ _id: req.params.boardId, owner: req.userId });
    if (!board) return res.status(404).json({ error: "Board not found" });
    
    const tasks = await Task.find({ board: board._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/board/:boardId", async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate, estimatedEffort } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        _id: "mock-task-" + Date.now(), 
        title, description, status, priority, dueDate, estimatedEffort, 
        board: req.params.boardId, owner: req.userId, createdAt: new Date().toISOString() 
      });
    }

    const board = await Board.findOne({ _id: req.params.boardId, owner: req.userId });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const task = await Task.create({
      title, description, status, priority, dueDate, estimatedEffort,
      board: board._id,
      owner: req.userId
    });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate, estimatedEffort } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        _id: req.params.id, 
        title, description, status, priority, dueDate, estimatedEffort, 
        board: "mock-board", owner: req.userId, createdAt: new Date().toISOString() 
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title, description, status, priority, dueDate, estimatedEffort },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export const taskRoutes = router;
