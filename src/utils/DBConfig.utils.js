const mongoose =require('mongoose')
const connectDb=async()=>{
    try {
       const data= await mongoose.connect(process.env.DB_URL||"")
       console.log(`Database connected with ${data.connection.host} `)
        
    } catch (error) {
        console.log(error.message)
        setTimeout(() => {
            connectDb()
        }, 5000);
        
    }
}
module.exports=connectDb