const mongoose = require('mongoose')
const machineDB = require('./machineDB.js')


const connection = async () =>{
    const URL = 'mongodb://127.0.0.1:27017/MRS9000'
    // const URL = "mongodb+srv://hunch:hunch@hunch.vysl720.mongodb.net/Hantex?retryWrites=true&w=majority"
    try {
        // await mongoose.connect(URL)
        await mongoose.connect(URL)
        // await mongoose.connect(URL, {useUnifiedTopology:true , useNewUrlParser:true})
        console.log("DataBase Connected")
        machineDB()
    } catch (error) {
         console.log("Error While connecting wit the database ", error);
    }
}

module.exports =  connection;