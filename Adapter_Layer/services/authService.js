import * as AuthAdapter from "../adapters/authAdapter.js";
import validator from "validator";

const createValidationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

export const registerStudent = async (studentProfile) => {
    if (!studentProfile.name) {
        throw createValidationError("Student name is required");
    }
    if (!studentProfile.birthdate) {
        throw createValidationError("Birthdate is required");
    }
    if (!studentProfile.program) {
        throw createValidationError("Program is required");
    }
    if (!studentProfile.address) {
        throw createValidationError("Address is required");
    }
    if (!studentProfile.studentStatus) {
        throw createValidationError("Student status is required");
    }
    if (
        typeof studentProfile.email !== "string" ||
        studentProfile.email.trim() === ""
    ) {
        throw createValidationError("Email is required");
    }
    if (!validator.isEmail(studentProfile.email.trim())) {
        throw createValidationError("Invalid email address");
    }
    if (
        typeof studentProfile.password !== "string" ||
        studentProfile.password.trim() === ""
    ) {
        throw createValidationError("Password is required");
    }
    if (!validator.isStrongPassword(studentProfile.password)) {
        throw createValidationError(
            "Password is not strong enough. Use at least 8 characters with uppercase, lowercase, number, and symbol."
        );
    }

    return await AuthAdapter.createUser(studentProfile);
};

export const getStudents = async () => {
    return await AuthAdapter.getAllUsers();
};

export const getStudentById = async (userId) => {
    if (!userId || `${userId}`.trim() === "") {
        throw createValidationError("User id is required");
    }

    return await AuthAdapter.getUserById(userId);
};

export const login = async (credentials = {}) => {
    const email =
        typeof credentials.email === "string" ? credentials.email.trim() : "";
    const password =
        typeof credentials.password === "string" ? credentials.password : "";

    if (!email) {
        throw createValidationError("Email is required");
    }

    if (!password) {
        throw createValidationError("Password is required");
    }

    return await AuthAdapter.login({ email, password });
};
