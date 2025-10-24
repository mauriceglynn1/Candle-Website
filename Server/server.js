import express from "express";
import cors from "cors";
import user from "./routes/user.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../config.env") });

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", user);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
