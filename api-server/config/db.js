const mongoose = require('mongoose')

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB || 'exonium',
            tls: true,
            serverSelectionTimeoutMS: 5000,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        return conn
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB
