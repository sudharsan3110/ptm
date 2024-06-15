import express from "express";

const app = express();
import cors from 'cors';
import router from "./routes/index.js";

app.use(express.json());
app.use("/api/v1",router);
app.use(cors());

app.listen(3000);

