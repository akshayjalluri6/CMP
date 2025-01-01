import pool from "../db/db.js";
import DriverModel from "./DriverModel.js";
import RidesModel from "./RidesModel.js";
import VehicleModel from "./VehicleModel.js";

const DailyLogsModel = {
    async createDailyLogsTable(){
        const query = `
        CREATE TABLE IF NOT EXISTS daily_logs(
        ride_id UUID,
        start_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        vehicle_no VARCHAR(255) NOT NULL,
        driver_id UUID NOT NULL,
        vendor_id UUID,
        log_status VARCHAR(255) NOT NULL DEFAULT 'present',
        PRIMARY KEY (ride_id, start_date),
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
        FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Daily logs table created successfully");
        } catch (error) {
            throw error
        }
    },

    async getDailyLogs(){
        const query = `
        SELECT * FROM daily_logs;
        `;
        console.log("Hello")

        try {
            const result = await pool.query(query);
            console.log(result)
            return result.rows;
        } catch (error) {
            throw error
        }
    },

    async getLogs (){
        const query = `
        SELECT * FROM daily_logs;
        `;

        try {
            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            throw error;
        }
    },

    async getDailyLogs(driver_id, date){
        const query = `
        SELECT * FROM daily_logs
        WHERE driver_id = $1 AND DATE(start_date) = $2
        `;

        try {
            const values = [driver_id, date];
            const result = await pool.query(query, values);
            return result.rows 
        } catch (error) {
            throw error
        }
    },

    async addDailyLog(ride_id, start_date, start_time, vehicle_no, driver_id, vendor_id){
        const query = `
        INSERT INTO daily_logs (ride_id, start_date, start_time, vehicle_no, driver_id, vendor_id)
        VALUES ($1, $2, $3, $4, $5, $6);
        `;

        try {
            const date = new Date(start_date).toISOString().split('T')[0];
            const values = [ride_id, date, start_time, vehicle_no, driver_id, vendor_id];
            await pool.query(query, values);
            await DriverModel.updateDriverStatus(driver_id, "busy");
            await VehicleModel.updateVehicleStatus(vehicle_no, "busy");
            return "Daily log added successfully";
        } catch (error) {
            throw error;
        }
    },

    async getLastLog(ride_id){
        const query = `
        SELECT * FROM daily_logs
        WHERE ride_id = $1
        ORDER BY start_date DESC
        LIMIT 1;
        `;

        try {
            const values = [ride_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error
        }
    },

    async getLastLogStartDate(ride_id){
        const query = `
        SELECT start_date AT TIME ZONE 'Asia/Kolkata' AS normalized_date FROM daily_logs
        WHERE ride_id = $1 AND end_time IS NULL
        ORDER BY start_date DESC LIMIT 1;
        `;

        try {
            const values = [ride_id];
            const result = await pool.query(query, values);
            if(result.rows.length === 0){
                throw new Error(`No logs found for ride ${ride_id}`);
            }
            const start_date = result.rows[0].normalized_date.toISOString().split('T')[0];
            return start_date;
        } catch (error) {
            throw error;
        }
    },

    async getLastLogStartTime(ride_id){
        const query = `
        SELECT start_time FROM daily_logs
        WHERE ride_id = $1 AND end_time IS NULL
        ORDER BY start_date DESC LIMIT 1;
        `;

        try {
            const values = [ride_id];
            const result = await pool.query(query, values);
            return result.rows[0].start_time;
        } catch (error) {
            throw error
        }
    },

    async startRide(ride_id, start_time, log_status, start_date){
        const query = `
        UPDATE daily_logs
        SET start_time = $1, log_status = $2
        WHERE ride_id = $3 AND start_date = $4;
        `;

        try {
            const values = [start_time, log_status, ride_id, start_date];
            await pool.query(query, values);
            return "Ride started successfully";
        } catch (error) {
            throw error;
        }
    },

    async endRide(ride_id, start_date, end_time){

        const start_time = await DailyLogsModel.getLastLogStartTime(ride_id);

        if(start_time === null){
            throw new Error("Ride is not started yet");
        }

        const query = `
        UPDATE daily_logs
        SET end_time = $1
        WHERE ride_id = $2 AND start_date = $3;
        `;

        try {
            const values = [end_time, ride_id, start_date];
            await pool.query(query, values);
            await RidesModel.updateRemainingDays(ride_id);
            return "Ride ended successfully";
        } catch (error) {
            throw error;
        }
    },

    async getDailyLogsByDate(date){
        const query = `
        SELECT * FROM daily_logs
        WHERE DATE(start_date) = $1;
        `;

        try {
            const values = [date];
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error
        }
    }
};


export default DailyLogsModel