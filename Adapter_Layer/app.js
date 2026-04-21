import express from "express";
import "dotenv/config.js";
import cors from "cors";

import UserRoutes from "./routes/UserRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "127.0.0.1";
const corsOptions = process.env.ORIGIN
    ? { origin: process.env.ORIGIN }
    : { origin: true };

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/auth", UserRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Adapter_Layer",
        host: HOST,
        port: PORT
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Adapter_Layer",
        host: HOST,
        port: PORT,
        routes: [
            "/api/auth/register",
            "/api/auth",
            "/api/auth/:userId"
        ]
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "No such endpoint exists" });
});

app.listen(PORT, HOST, () => {
    console.log(`Adapter_Layer listening on http://${HOST}:${PORT}`);
    console.log(`Adapter routes ready at /api/auth`);
});
