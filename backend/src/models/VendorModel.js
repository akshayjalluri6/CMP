import pool from "../db/db.js";
import bcrypt from "bcrypt"

const VendorModel = {
    async createVendorTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS vendors (
        bank_account_no VARCHAR(255) NOT NULL,
        bank_name VARCHAR(255) NOT NULL,
        ifsc_code VARCHAR(255) NOT NULL,
        user_id UUID UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (bank_account_no, ifsc_code),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Vendors table created successfully");
        } catch (error) {
            console.log("Error while creating vendors table: " + error)
            throw error
        }
    },

    async createVendor(bank_account_no, bank_name, ifsc_code, user_id){
        const query = `
        INSERT INTO vendors (bank_account_no, bank_name, ifsc_code, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `

        try {
            const values = [bank_account_no, bank_name, ifsc_code, user_id];
            const vendor = await pool.query(query, values);
            await pool.query(`UPDATE users SET role='vendor' WHERE id = $1`, [user_id])
            return vendor.rows[0];
        } catch (error) {
            console.log("Error while creating vendor: " + error)
            throw error
        }
    },
    
    async vendorVehicles(vendor_id){
        const query = `
        SELECT * FROM vehicles
        WHERE vendor_id = $1;
        `;

        try {
            const values = [vendor_id];
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error
        }
    }
}

export default VendorModel