import pool from "../config/db.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adapterLayerBaseUrl =
    process.env.ADAPTER_LAYER_URL || "http://127.0.0.1:5000/api/auth";

export const createUser = async (userProfile, email, password) => {
    console.log("Auth Model: createUser called");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        email.trim() === "" ||
        password.trim() === ""
    ) {
        const error = new TypeError("Email and Password are required.");
        error.statusCode = 400;
        throw error;
    }

    if (!validator.isEmail(email)) {
        const error = new TypeError("Invalid email address.");
        error.statusCode = 400;
        throw error;
    }

    if (!validator.isStrongPassword(password)) {
        const error = new TypeError("Password is not strong enough.");
        error.statusCode = 400;
        throw error;
    }

    const [user] = await pool.query(
        "SELECT email FROM tbluser WHERE email = ?",
        [email]
    );

    if (user.length === 1) {
        const error = new Error(`The email ${email} is already used.`);
        error.statusCode = 400;
        throw error;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        console.log("Auth Model: Sending payload to adapter", userProfile);

        const response = await fetch(`${adapterLayerBaseUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userProfile)
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error = new Error(
                `Adapter Layer error: ${response.status} - ${errorText}`
            );
            error.statusCode = response.status;
            throw error;
        }

        const createdStudent = await response.json();

        await connection.query(
            "INSERT INTO tbluser(email, password) VALUES(?, ?)",
            [email, hashedPassword]
        );

        console.log("DB: User inserted successfully");

        await connection.commit();
        connection.release();

        return createdStudent;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};

export const login = async (email, password) => {
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        email.trim() === "" ||
        password.trim() === ""
    ) {
        const error = new Error("Email and password is required.");
        error.statusCode = 400;
        throw error;
    }

    const [user] = await pool.query(
        "SELECT * FROM tbluser WHERE email = ?",
        [email]
    );

    if (user.length === 0) {
        const error = new Error(
            `An account with the email: ${email} does not exist.`
        );
        error.statusCode = 400;
        throw error;
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
        const error = new Error("Incorrect password.");
        error.statusCode = 400;
        throw error;
    }

    const token = jwt.sign({ id: user[0].id }, process.env.SECRET, {
        expiresIn: "1d"
    });

    return token;
};

export const getUser = async (id) => {
    if (isNaN(parseInt(id))) {
        throw new Error("Invalid id");
    }

    const [user] = await pool.query("SELECT * FROM tbluser WHERE id = ?", [id]);

    return user;
};
