import pool from "../db/db.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY || 'secretkey';

const UserModel = {
    async createUsersTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) DEFAULT 'user',
        phone_no VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        `;

        try {
            await pool.query(query);
            console.log("Users table created successfully");            
        } catch (error) {
            console.log("Error while creating users table: " + error)
        }
    },

    async createUser(name, email, password, role = "user", phone_no, address){
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
        INSERT INTO users (name, email, password, role, phone_no, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;

        try {
            const values = [name, email, hashedPassword, role, phone_no, address];
            const user = await pool.query(query, values);
            return user.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async updateUser(role, user_id){
        const query = `
        UPDATE users SET role=$1 WHERE id = $2;
        `;

        try {
            const values = [role, user_id];
            return await pool.query(query, values);
        } catch (error) {
            throw error
        }
    },

    async userLogin(email, password){
        const query = `
        SELECT * FROM users
        WHERE email = $1;
        `;

        try {
            const user = await pool.query(query, [email]);

            //Check if user exists
            if (user.rows.length === 0) {
                throw new Error("User not found try to create a new account");
            }

            //Verify password
            const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

            if(!isPasswordValid) {
                throw  new Error("Invalid Password");
            }

            //Generate JWT
            const payload = {user_id: user.rows[0].id};
            const jwt_token = jwt.sign(payload, secretKey, {expiresIn: '1d'} )
            return jwt_token;

        } catch (error) {
            throw error;
        }
    },

    async getUsers() {
        const query = `
        SELECT name, email, role, phone_no, address FROM users;
        `;

        try {
            return await pool.query(query);
        } catch (error) {
            throw error;
        }
    },

    async getDrivers() {
        const query = `
        SELECT name, email, phone_no, address FROM users
        WHERE role = 'driver';
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error
        }
    }
}

export default UserModel