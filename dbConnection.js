require("dotenv").config()
const express = require("express")
const app = express()
const mysql = require("mysql")

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
   connectionLimit: 100,
   host: "localhost",       //This is your localhost IP
   user: "root",         // "newuser" created in Step 1(e)
   password: "",  // password for the new user
   database: "emailsicantsend",      // Database name
   port: "3306"             // port name, "3306" by default
})
db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
})

const port = process.env.PORT
app.listen(port, 
()=> console.log(`Server Started on port ${port}...`))