const mongoose = require('mongoose')
const db=require('./config/config').get(process.env.NODE_ENV);
async function connectToMongoDB(){
    try {
        
        const connectionInstance = await mongoose.connect(db.DATABASE)
        console.log("connected to MongoDB",connectionInstance.connection.host);
        return connectionInstance;
    } catch (error) {
        console.log("ERROR: ",error);
        throw error;
    }
}

module.exports = {connectToMongoDB}