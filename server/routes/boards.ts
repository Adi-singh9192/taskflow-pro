import { Router } from "express";
import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { Task } from "../models/Task.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    const boards = await Board.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (mongoose.connection.readyState !== 1) {
      return res.json({ _id: "mock-board-" + Date.now(), title, description, createdAt: new Date().toISOString() });
    }
    const board = await Board.create({ title, description, owner: req.userId });
    res.json(board);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!board) return res.status(404).json({ error: "Board not found" });
    await Task.deleteMany({ board: board._id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export const boardRoutes = router;
