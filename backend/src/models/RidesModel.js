import pool from "../db/db.js";

const RidesModel = {
    async createRidesModel(){
        const query = `
        CREATE TABLE IF NOT EXISTS rides(
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        remaining_days INT DEFAULT 0,
        cost_per_day FLOAT NOT NULL,
        remarks VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        `;

        try {
            await pool.query(query);
            console.log("Rides table created successfully");
        } catch (error) {
            throw error
        }
    },

    async addRide(client_name, duration, cost_per_day){
        const remaining_days = duration
        const query = `
        INSERT INTO rides(client_name, duration, remaining_days, cost_per_day)
        VALUES($1, $2, $3, $4);
        `;

        try {
            const values = [client_name, duration, remaining_days, cost_per_day];
            await pool.query(query, values);
            return "Ride added successfully";
        } catch (error) {
            throw error
        }
    },

    async getRides(){
        const query = `
        SELECT * FROM rides;
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async getActiveRides(){
        const query = `
        SELECT * FROM rides
        WHERE remaining_days > 0;
        `;

        try {
            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            throw error
        }
    },

    async updateRemainingDays(ride_id){
        const remainingDays = `
        SELECT remaining_days FROM rides
        WHERE id = $1;
        `;
        
        try {
            const values = [ride_id];
            const result = await pool.query(remainingDays, values);
            const remaining = result.rows[0].remaining_days - 1;
            await pool.query(`UPDATE rides SET remaining_days = $1 WHERE id = $2`, [remaining, ride_id]);
            console.log(`Remaining days updated to ${remaining}`);
            return "Remaining days updated successfully";
        } catch (error) {
            throw error
        }
    }
}

export default RidesModel