import pkg from "pg"
const {Pool} = pkg

import {configDotenv} from "dotenv"
configDotenv()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

pool.connect()
    .then(() => {
        console.log("Database connected")
    })
    .catch((error) => {
        console.log(error)
    })

export default pool