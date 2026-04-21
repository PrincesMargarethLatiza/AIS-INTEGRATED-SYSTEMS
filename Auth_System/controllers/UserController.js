import * as UserModel from "../models/UserModel.js";
import { normalizeStudentProfile } from "../../shared/studentProfile.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userProfile = normalizeStudentProfile(req.body);

        console.log("Auth Controller: Outgoing payload", userProfile);

        const createdStudent = await UserModel.createUser(
            userProfile,
            email,
            password
        );

        res.status(201).json(createdStudent);

    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message || "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await UserModel.login(email, password);

        res.status(200).json({
            success: true,
            message: [
                { result: "Login successful", token },
            ]
        });
    } catch (error) {
        console.log(error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
