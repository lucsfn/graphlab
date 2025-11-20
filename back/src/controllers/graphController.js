import express from "express";
import GraphService from "../services/graphService.js";

const router = express.Router();

router.post("/run", (req, res) => {
  try {
    const body = req.body;
    const result = GraphService.runAlgorithm(body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message || err, code: err.code || "UNKNOWN" });
  }
});

export default router;
