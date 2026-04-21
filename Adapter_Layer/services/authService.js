import * as AuthAdapter from "../adapters/authAdapter.js";

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
