import pool from "../db/db.js";
import DriverModel from "./DriverModel.js";
import VehicleModel from "./VehicleModel.js";
import RidesModel from "./RidesModel.js";
import UserModel from "./UserModel.js";

const BackupModel = {
    async createBackupTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS backup (
        ride_id UUID,
        date DATE NOT NULL,
        vehicle_no VARCHAR(255) NOT NULL,
        vehicle_model TEXT NOT NULL,
        driver_name TEXT NOT NULL,
        driver_phone_no TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        amount INT NOT NULL,
        PRIMARY KEY (ride_id, date),
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
        FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Backup table created successfully");
        } catch (error) {
            throw error;
        }
    },

    async addBackup(ride_id, date, vehicle_no, driver_id) {
        let price = await RidesModel.getRideById(ride_id);
        price = price.cost_per_day;
        const amount = price / 2;
        const vehicle_details = await VehicleModel.getVehicleDetails(vehicle_no);
        let vendor_id = vehicle_details.vendor_id;
        let vendor_details = await UserModel.getUserById(vendor_id);
        let vendor_name = vendor_details.name;
        let vehicle_model = vehicle_details.vehicle_model;
        const driverDetails = await UserModel.getUserById(driver_id);
        let driver_name = driverDetails.name;
        let driver_phone_no = driverDetails.phone_no;
        const query = `
        INSERT INTO backup (ride_id, date, vehicle_no, vehicle_model, driver_name, driver_phone_no, vendor_name, amount)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;

        try {
            const start_date = new Date(date).toISOString().split('T')[0];
            const value = [ride_id, start_date, vehicle_no, vehicle_model, driver_name, driver_phone_no, vendor_name, amount];
            await pool.query(query, value);
            await DriverModel.updateDriverStatus(driver_id, "busy");
            await VehicleModel.updateVehicleStatus(vehicle_no, "busy");
            return "Backup Vehicle added successfully";
        } catch (error) {
            throw error
        }
    },

    async getBackupVehcileDetails(ride_id, date) {
        const query = `
        SELECT * FROM backup
        WHERE ride_id = $1 AND DATE(date) = $2;
        `;

        try {
            const values = [ride_id, date];
            const result = await pool.query(query, values);
            return result.rows
        } catch (error) {
            throw error;
        }
    }
}

export default BackupModel;