import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Wellcome to my first backend application</h1>");
});

app.listen("3000", () => {
  console.log(`Running server at port ${port}`);
});
