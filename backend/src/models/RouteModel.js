import pool from "../db/db.js";

const RouteModel = {
    async createRoutesTable(){
        const query = `
        CREATE TABLE IF NOT EXISTS routes(
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        total_distance FLOAT NOT NULL,
        total_tolls INT NOT NULL,
        each_toll_price FLOAT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        `;

        try {
            await pool.query(query);
            console.log("Routes table created successfully");
        } catch (error) {
            throw error;
        }
    },

    async addRoute(source, destination, total_distance, total_tolls, each_toll_price) {
        const query = `
        INSERT INTO routes (source, destination, total_distance, total_tolls, each_toll_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

        try {
            const values = [source, destination, total_distance, total_tolls, each_toll_price];
            await pool.query(query, values);
            return "Route added successfully";
        } catch (error) {
            throw error
        }
    },

    async getRoutes(){
        const query = `
        SELECT * FROM routes;
        `;

        try {
            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            throw error
        }
    }
}

export default RouteModel