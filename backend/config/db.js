// backend/config/db.js

// Import the Mongoose library
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database
const connectDB = async () => {
  // A try...catch block to handle connection errors
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    // mongoose.connect() returns a promise, so we use 'await'
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a confirmation message
    // conn.connection.host gives us the host we are connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during connection, log the error message
    console.error(`Error: ${error.message}`);
    
    // Exit the Node.js process with a 'failure' code (1)
    // This is important because if the app can't connect to the database,
    // it can't function properly, so we should stop it.
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other parts of our application
module.exports = connectDB;