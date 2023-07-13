const mongoose = require('mongoose');
require('dotenv').config();

const connectionDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected');
    }
    catch(error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit with failure
      }
}


module.exports = connectionDB;


