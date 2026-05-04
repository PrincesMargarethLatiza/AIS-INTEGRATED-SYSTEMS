import * as AuthService from "../services/authService.js";

const normalizeStudentProfile = (payload = {}) => {
    const firstName =
        typeof payload.firstName === "string" ? payload.firstName.trim() : "";
    const lastName =
        typeof payload.lastName === "string" ? payload.lastName.trim() : "";
    const dob = typeof payload.dob === "string" ? payload.dob.trim() : "";
    const course =
        typeof payload.course === "string" ? payload.course.trim() : "";
    const major = typeof payload.major === "string" ? payload.major.trim() : "";
    const status =
        typeof payload.status === "string" ? payload.status.trim() : "";
    const address =
        typeof payload.address === "string" ? payload.address.trim() : "";
    const email =
        typeof payload.email === "string" ? payload.email.trim() : "";
    const password =
        typeof payload.password === "string" ? payload.password : "";

    return {
        firstName,
        lastName,
        dob,
        course,
        major,
        status,
        email,
        password,
        name: [firstName, lastName].filter(Boolean).join(" "),
        birthdate: dob,
        address,
        program: [course, major].filter(Boolean).join(" - "),
        studentStatus: status
    };
};

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
    try {
        const result = await AuthService.login(req.body);
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.details?.message || e.message || "Login failed"
        });
    }
};

export const registerHelp = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Use POST for registration.",
        method: "POST",
        endpoint: "/api/auth/register",
        sampleBody: {
            email: "pmlatiza@gmail.com",
            password: "Princes28",
            firstName: "Princes Margareth",
            lastName: "Latiza",
            dob: "2005-02-28",
            address: "Balayan Batangas",
            course: "BSIT",
            major: "Information Security",
            status: "Regular"
        }
    });
};
