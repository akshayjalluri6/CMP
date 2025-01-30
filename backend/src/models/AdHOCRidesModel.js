import pool from "../db/db.js";
import VehicleModel from "./VehicleModel.js";

const AdHOCRidesModel = {
    async createAdHOCRidesTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS ad_hoc_rides (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_phone_no VARCHAR(255) NOT NULL,
        client_address VARCHAR(255),
        vehicle_no VARCHAR(255) NOT NULL,
        vehicle_type VARCHAR(255),
        vehicle_model VARCHAR(255),
        driver_name VARCHAR(255) NOT NULL,
        driver_phone_no VARCHAR(255),
        price FLOAT NOT NULL,
        date DATE NOT NULL,
        type VARCHAR(255) NOT NULL DEFAULT 'ad_hoc',
        FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Ad Hoc Rides table created successfully");
        } catch (error) {
            console.log("Error while creating Ad Hoc rides table: " + error)
        }
    },

    async getRides() {
        const query = `
            SELECT * FROM ad_hoc_rides;  
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async getRidesByDate(date) {
        const query = `
            SELECT * FROM ad_hoc_rides WHERE date = $1;  
        `;

        try {
            const values = [date];
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async addRide (client_name, client_phone_no, vehicle_no, driver_name, price, date) {
        const query = `
        INSERT INTO ad_hoc_rides (client_name, client_phone_no, vehicle_no, driver_name, price, date)
        VALUES ($1, $2, $3, $4, $5, $6);
        `;

        try {
            const vehicle = await VehicleModel.getVehicleDetails(vehicle_no);
            if (!vehicle) {
                await VehicleModel.createVehicle(vehicle_no, "", "", "available");
            }
            const values = [client_name, client_phone_no, vehicle_no, driver_name, price, date];
            await pool.query(query, values);
            return "Ride added successfully";
        } catch (error) {
            throw error;
        }
    },

    async updateRide(id, client_name, client_phone_no, client_address, vehicle_no, vehicle_type, vehicle_model, driver_name, driver_phone_no, price, date) {
        const query = `
        UPDATE ad_hoc_rides
        SET client_name = $2, client_phone_no = $3, client_address = $4, vehicle_no = $5, vehicle_type = $6, vehicle_model = $7, driver_name = $8, driver_phone_no = $9, price = $10, date = $11
        WHERE id = $1;
        `;

        try {
            const values = [id, client_name, client_phone_no, client_address, vehicle_no, vehicle_type, vehicle_model, driver_name, driver_phone_no, price, date];
            await pool.query(query, values);
            return "Ride updated successfully";
        } catch (error) {
            throw error;
        }
    }
}

export default AdHOCRidesModel