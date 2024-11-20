import pool from "../db/db.js";

const RidesModel = {
    async createRidesModel(){
        const query = `
        CREATE TABLE IF NOT EXISTS rides(
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        duration INT NOT NULL,
        remaining_days INT DEFAULT 0,
        route_id UUID,
        cost_per_day FLOAT NOT NULL,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
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

    async addRide(duration, route_id, cost_per_day){
        const remaining_days = duration
        const query = `
        INSERT INTO rides(duration, remaining_days, route_id, cost_per_day)
        VALUES($1,$2,$3, $4);
        `;

        try {
            const values = [duration, remaining_days, route_id, cost_per_day];
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