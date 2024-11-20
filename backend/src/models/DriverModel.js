import pool from "../db/db.js";

const DriverModel = {
    async createDriverTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS drivers (
        license_no VARCHAR(255) PRIMARY KEY,
        license_type VARCHAR(255) NOT NULL,
        user_id UUID UNIQUE,
        status text NOT NULL DEFAULT 'available',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Drivers table created successfully");
        } catch (error) {
            console.log("Error while creating drivers table: " + error)
        }
    },

    async createDriver(license_no, license_type, user_id){
        const query = `
        INSERT INTO drivers (license_no, license_type, user_id) 
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        try {
            const values = [license_no, license_type, user_id];
            const driver = await pool.query(query, values);
            await pool.query(`UPDATE users SET role = 'driver' WHERE id = $1`, [user_id]);
            return driver.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async getDriverStatus(driver_id){
        const query = `
        SELECT status FROM drivers
        WHERE user_id = $1;
        `;

        try {
            const values = [driver_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async findAvailableDriver(license_type){
        const query = `
        SELECT * FROM drivers 
        WHERE status = 'available' AND license_type = $1 LIMIT 1;
        `;

        try {
            const values = [license_type];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error
        }
    },

    async getLicenseType(driver_id){
        const query = `
        SELECT license_type FROM drivers
        WHERE user_id = $1;
        `;

        try {
            const values = [driver_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

export default DriverModel