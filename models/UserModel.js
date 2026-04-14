import pool from "../config/db.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createUser = async (userProfile, email, password) => {

    // Validation para sa userProfile fields
    if (
        !userProfile.name || userProfile.name.trim() === '' ||
        !userProfile.birthdate || userProfile.birthdate.trim() === '' ||
        !userProfile.address || userProfile.address.trim() === '' ||
        !userProfile.program || userProfile.program.trim() === '' ||
        !userProfile.studentStatus || userProfile.studentStatus.trim() === '' ||
        !email || email.trim() === '' ||
        !password || password.trim() === ''
    ) {
        const error = new Error('All fields are required.');
        error.statusCode = 400;
        throw error;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        const error = new Error('Invalid email address.');
        error.statusCode = 400;
        throw error;
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
        const error = new Error('Password is not strong enough. Use at least 8 characters with uppercase, lowercase, number, and symbol.');
        error.statusCode = 400;
        throw error;
    }

    // Check if email already exists
    const [existingUser] = await pool.query(
        "SELECT email FROM tbluser WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {
        const error = new Error(`Email ${email} is already used.`);
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert user into database - FIXED: separate columns instead of one userProfile column
    await pool.query(
        `INSERT INTO tbluser(
            name, 
            birthdate, 
            address, 
            program, 
            studentStatus, 
            email, 
            password
        ) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [
            userProfile.name.trim(), 
            userProfile.birthdate.trim(), 
            userProfile.address.trim(), 
            userProfile.program.trim(), 
            userProfile.studentStatus.trim(), 
            email.trim(), 
            hashedPassword
        ]
    );

    return { message: "User created successfully" };
};

export const login = async (email, password) => {

    if (!email || email.trim() === '' || !password || password.trim() === '') {
        const error = new Error('Email and password are required.');
        error.statusCode = 400;
        throw error;
    }

    // Get user by email
    const [user] = await pool.query(
        "SELECT * FROM tbluser WHERE email = ?",
        [email.trim()]
    );

    if (user.length === 0) {
        const error = new Error(`Account not found.`);
        error.statusCode = 404;
        throw error;
    }

    // Verify password
    if (!bcrypt.compareSync(password, user[0].password)) {
        const error = new Error('Incorrect password.');
        error.statusCode = 401;
        throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
        { 
            id: user[0].id,
            email: user[0].email,
            name: user[0].name
        },
        process.env.SECRET,
        { expiresIn: '1d' }
    );

    return { 
        token, 
        user: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            program: user[0].program,
            studentStatus: user[0].studentStatus
        }
    };
};

export const getUser = async (id) => {

    if (!id || isNaN(id)) {
        throw new Error('Invalid user Id.');
    }

    const [user] = await pool.query(
        "SELECT id, name, birthdate, address, program, studentStatus, email, created_at FROM tbluser WHERE id = ?",
        [id]
    );

    if (user.length === 0) {
        throw new Error('User not found.');
    }

    return user[0];
};

// Additional helper function: Get all users
export const getAllUsers = async () => {
    const [users] = await pool.query(
        "SELECT id, name, email, program, studentStatus, created_at FROM tbluser ORDER BY id DESC"
    );
    return users;
};

// Additional helper function: Update user
export const updateUser = async (id, userProfile) => {
    
    if (!id || isNaN(id)) {
        throw new Error('Invalid user Id.');
    }

    const [existingUser] = await pool.query(
        "SELECT id FROM tbluser WHERE id = ?",
        [id]
    );

    if (existingUser.length === 0) {
        throw new Error('User not found.');
    }

    await pool.query(
        `UPDATE tbluser SET 
            name = ?, 
            birthdate = ?, 
            address = ?, 
            program = ?, 
            studentStatus = ?
        WHERE id = ?`,
        [
            userProfile.name.trim(),
            userProfile.birthdate.trim(),
            userProfile.address.trim(),
            userProfile.program.trim(),
            userProfile.studentStatus.trim(),
            id
        ]
    );

    return { message: "User updated successfully" };
};

// Additional helper function: Delete user
export const deleteUser = async (id) => {
    
    if (!id || isNaN(id)) {
        throw new Error('Invalid user Id.');
    }

    const [existingUser] = await pool.query(
        "SELECT id FROM tbluser WHERE id = ?",
        [id]
    );

    if (existingUser.length === 0) {
        throw new Error('User not found.');
    }

    await pool.query("DELETE FROM tbluser WHERE id = ?", [id]);

    return { message: "User deleted successfully" };
};