const { Pool, Client } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const credentials = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
};
 
const connectDb = async () => {
    try {
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })
 
        await client.connect()
        const res = await client.query('SELECT * FROM some_table')
        console.log(res)
        await client.end()
    } catch (error) {
        console.log(error)
    }
}

const queryIngredient = async (ingredient) => {
    const pool = new Pool(credentials);
    const text = `SELECT * FROM ingredients WHERE name = $1`;
    const values = [ingredient];
    return pool.query(text, values);
}
  
queryIngredient()