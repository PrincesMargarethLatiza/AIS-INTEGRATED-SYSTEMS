import * as UserController from "../controllers/UserController.js";
import express from "express";

const userRoutes = express.Router();

userRoutes.post("/", UserController.createUser);
userRoutes.post("/register", UserController.createUser);
userRoutes.get("/register", UserController.registerHelp);
userRoutes.get("/", UserController.getAllUsers);
userRoutes.post("/login", UserController.login);
userRoutes.get("/:userId", UserController.getUserUsingUserId);

export default userRoutes;
