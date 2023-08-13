const mongoose = require('mongoose')

const connectToDb = async()=>{
    
    //connect with databse 
    mongoose.connect(process.env.MONGO_URL)
    .then((conn)=>{
        console.log(`Database connected successfully at ${conn.connection.host}`);
    }).catch((err)=>{
        console.log(`Error while connecting to database  `,err.message);
    })
}

module.exports = connectToDb