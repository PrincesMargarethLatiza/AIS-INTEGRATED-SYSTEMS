import * as UserController from "../controllers/UserController.js";
import express from "express";

const userRoutes = express.Router();

userRoutes.post("/", UserController.createUser);
userRoutes.post("/register", UserController.createUser);
userRoutes.get("/", UserController.getAllUsers);
userRoutes.get("/:userId", UserController.getUserUsingUserId);
userRoutes.post("/login", UserController.login);

export default userRoutes;
