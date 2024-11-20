import { validate } from "node-cron";
import pool from "../db/db.js";

const VehicleModel = {
    async createVehicleTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS vehicles(
        vehicle_no VARCHAR(255) PRIMARY KEY,
        vehicle_type VARCHAR(255) NOT NULL,
        vehicle_model VARCHAR(255) NOT NULL,
        vendor_id UUID,
        status text NOT NULL DEFAULT 'available',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Vehicles table created successfully");
        } catch (error) {
            console.log("Error while creating vehicles table: " + error)
        }
    },

    async createVehicle(vehicle_no, vehicle_type, vehicle_model, vendor_id, status){
        const query = `
        INSERT INTO vehicles (vehicle_no, vehicle_type, vehicle_model, vendor_id, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

        try {
            const values = [vehicle_no, vehicle_type, vehicle_model, vendor_id, status];
            await pool.query(query, values);
            return "Vehicle created successfully";
        } catch (error) {
            throw error
        }
    },

    async getVehicleStatus(vehicle_no){
        const query = `
        SELECT status FROM vehicles
        WHERE vehicle_no = $1;
        `;

        try {
            const values = [vehicle_no];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error
        }
    },

    async findAvailableVehicle(vehicle_type){
        const query = `
        SELECT * FROM vehicles
        WHERE status = 'available' AND vehicle_type = $1 LIMIT 1;
        `;

        try {
            const values = [vehicle_type];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async getVehicleType(vehicle_no){
        const query = `
        SELECT vehicle_type FROM vehicles
        WHERE vehicle_no = $1;
        `;

        try {
            const values = [vehicle_no];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error
        }
    },

    async getVendor(vehicle_no){
        const query = `
        SELECT vendor_id FROM vehicles
        WHERE vehicle_no = $1;
        `;

        try {
            const values = [vehicle_no];
            const result = await pool.query(query, values);
            console.log(result.rows[0]);
            return result.rows[0];
        } catch (error) {
            throw error
        }
    }
}

export default VehicleModel