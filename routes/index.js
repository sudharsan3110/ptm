import express from 'express';

const router = express.Router();
import useRouter from"./user.js"
import accountUser from"./account.js"

const app = express();

// Use express.json() middleware to parse JSON bodies
app.use(express.json());
router.use("/user",useRouter);
router.use("/account",accountUser);

export default router;