import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import graphController from "./controllers/graphController.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/graph", graphController);

app.get("/", (req, res) => res.json({ status: "ok" }));

app.listen(port, () => {
  console.log(`Back-end running on http://localhost:${port}`);
});
