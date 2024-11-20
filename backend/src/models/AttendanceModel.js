import pool from "../db/db.js";

const AttendanceModel = {
    async createAttendanceTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS attendances(
        id UUID,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        PRIMARY KEY (id, date),
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Attendances table created successfully");
        } catch (error) {
            throw error
        }
    },

    async getAttendances() {
        const query = `
        SELECT status, date FROM attendances
        JOIN users ON attendances.id = users.id
        ORDER BY date DESC;
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error
        }
    },

    async getPresents() {
        const query = `
        SELECT * FROM attendances
        WHERE status = 'present'
        ORDER BY date DESC;
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async getAbsents(){
        const query = `
        SELECT * FROM attendances
        WHERE status = 'absent'
        ORDER BY date DESC;
        `;

        try {
            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            throw error
        }
    },

    async updateAttendances(attendanceList){
        const query = `
        INSERT INTO attendances(id, status, date)
        VALUES ($1, $2, $3)
        ON CONFLICT (id, date)
        DO UPDATE SET status = EXCLUDED.status;
        `;

        try {
            const client = await pool.connect();
            await client.query("BEGIN");

            for(const {id, status, date} of attendanceList){
                const values = [id, status, date];
                await client.query(query, values);
            }

            await client.query("COMMIT");
            client.release();
            return "Attendances updated successfully";
        } catch (error) {
            await client.query("ROLLBACK");
            client.release();
            throw error;
        }
    }
}

export default AttendanceModel