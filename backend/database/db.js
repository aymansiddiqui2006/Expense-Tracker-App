import mongoose from "mongoose";

const DBconnect=async()=>{
    try {
        const response=await mongoose.connect(`${process.env.DB_URL}`)
        console.log(`MongoDB connected !! DB host ${response.connection.host}` )

    } catch (error) {
        console.log("somthing went wrong !! DB not conneted ",error)
        process.exit(1)
    }
}

export default DBconnect