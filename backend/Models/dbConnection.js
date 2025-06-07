const mongoose = require('mongoose');
require('dotenv').config()

const mongo_url = process.env.MongoDB_URI

mongoose.connect(mongo_url, {
    // Use correct SSL options for newer MongoDB driver
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
}).then(() => {
    console.log("Connected to MongoDB successfully")
}).catch((err) => {
    console.log("Error occurred while connecting to MongoDB:", err)
})
