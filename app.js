import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// morgan logger
// morgan tells who is requesting, what route
// it prints information about api request and response in console
app.use(morgan("tiny"));

export default app;
