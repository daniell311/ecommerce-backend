import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const env = dotenv.config().parsed;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use('/', apiRouter ); 

// app.use((req, res) => {
//     res.status(404).json({message:"404_NOT_FOUND"});
// })

app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
})