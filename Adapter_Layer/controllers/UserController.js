import * as AuthService from "../services/authService.js";
import { normalizeStudentProfile } from "../../shared/studentProfile.js";

export const createUser = async (req, res) => {
    try {
        console.log("Adapter Controller: Incoming payload", req.body);
        const userProfile = normalizeStudentProfile(req.body);
        const result = await AuthService.registerStudent(userProfile);

        res.status(201).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({
            success: false,
            message:
                e.details?.message ||
                e.message ||
                "An error occured while registering the student"
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await AuthService.getStudents();
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.details?.message || e.message || "Failed to fetch students"
        });
    }
};

export const getUserUsingUserId = async (req, res) => {
    try {
        const result = await AuthService.getStudentById(req.params.userId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.details?.message || e.message || "Failed to fetch student"
        });
    }
};

export const login = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Login is handled by the Auth_System service"
    });
};
