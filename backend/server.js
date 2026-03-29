import dotenv from 'dotenv'
import DBconnect from './database/db.js'
import app from './app.js'

dotenv.config({
    path:"./.env"
})

DBconnect()
.then(()=>{
    app.listen(process.env.PORT||800,()=>{
        console.log('server is running on port ',process.env.PORT)
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed",err)
})