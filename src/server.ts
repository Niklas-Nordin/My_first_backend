import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hej igen en gång till");
});

app.listen("3000", () => {
  console.log(`Running server at port ${port}`);
});
