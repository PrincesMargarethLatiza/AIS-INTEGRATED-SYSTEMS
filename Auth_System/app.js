import express from "express";
import "dotenv/config";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const adapterLayerUrl =
    process.env.ADAPTER_LAYER_URL || "http://127.0.0.1:5000/api/auth";
const corsOptions = process.env.ORIGIN
    ? { origin: process.env.ORIGIN }
    : { origin: true };

app.set("adapterLayerUrl", adapterLayerUrl);

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/user", UserRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/auth", UserRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth service is running",
        port: PORT,
        adapterLayerUrl
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Auth_System",
        port: PORT,
        routes: [
            "/api/auth/register",
            "/api/auth/login",
            "/api/users/register",
            "/user/register"
        ],
        adapterLayerUrl
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "No such endpoint exists" });
});

app.listen(PORT, () => {
    console.log(`Auth_System listening on port ${PORT}`);
    console.log(`Auth routes ready at /api/auth, /api/users, and /user`);
    console.log(`Adapter target: ${adapterLayerUrl}`);
});
