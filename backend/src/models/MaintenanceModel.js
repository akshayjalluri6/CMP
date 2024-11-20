import pool from "../db/db.js";

const MaintenanceModel = {
    async createMaintenanceTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS maintenances (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        vehicle_no VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        maintenance_cost FLOAT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Maintenances table created successfully");
        } catch (error) {
            console.log("Error while creating maintenances table: " + error)
        }
    }
}

export default MaintenanceModel