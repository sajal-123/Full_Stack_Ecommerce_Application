import mongoose from "mongoose"

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
    }catch(err){
        console.log(err)
    }
}

export {connectDB}