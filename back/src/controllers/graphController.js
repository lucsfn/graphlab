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

router.post("/bfs", (req, res) => {
  try {
    const { graph, params } = req.body;
    const result = GraphService.bfs(graph, params);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message || err, code: err.code || "UNKNOWN" });
  }
});

router.post("/dfs", (req, res) => {
  try {
    const { graph, params } = req.body;
    const result = GraphService.dfs(graph, params);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message || err, code: err.code || "UNKNOWN" });
  }
});

router.post("/dijkstra", (req, res) => {
  try {
    const { graph, params } = req.body;
    const result = GraphService.dijkstra(graph, params);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message || err, code: err.code || "UNKNOWN" });
  }
});

export default router;
