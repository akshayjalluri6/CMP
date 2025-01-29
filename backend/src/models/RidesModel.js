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
        total_kms FLOAT DEFAULT 0,
        ride_status VARCHAR(255),
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

    /*async addRide(client_name, duration, cost_per_day){
        const remaining_days = duration
        const query = `
        INSERT INTO rides(client_name, duration, remaining_days, cost_per_day)
        VALUES($1, $2, $3, $4);
        `;

        try {
            const values = [client_name, duration, remaining_days, cost_per_day];
            const result =await pool.query(query, values);
            console.log(result.rows)
            return "Ride added successfully";
        } catch (error) {
            throw error
        }
    },*/

    async addRides(client_name, duration, cost_per_day, total_kms){
        const query = `
        INSERT INTO rides(client_name, duration, cost_per_day, total_kms, ride_status)
        VALUES($1, $2, $3, $4, 'pending');
        `;

        try {
            const values = [client_name, duration, cost_per_day, total_kms];
            const result = await pool.query(query, values);
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

    //Get Ride by ID
    async getRideById(id){
        const query = `
        SELECT * FROM rides
        WHERE id = $1;
        `;

        try {
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error
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

    async updateRideStatus(ride_id, status){
        const query = `
        UPDATE rides
        SET ride_status = $1
        WHERE id = $2;
        `;

        try {
            const values = [status, ride_id];
            await pool.query(query, values);
            console.log(`Ride status updated to ${status}`);
            return "Ride status updated successfully";
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