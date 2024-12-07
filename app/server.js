const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.DB_URI).then(() => {
    console.log('connected to DB');  
}).catch(err => {
    console.log(err?.message ?? 'DB connection is failed');
    
})