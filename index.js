const dotenv=require('dotenv')
const app=require('./src/app.js')
const connectDb=require('./src/utils/DBConfig.utils.js')
const cloudinary=require('cloudinary')

dotenv.config()

// Env File Configation on top of the file 
// import {app} from './app.js'

// ################ Cloudinary config #########################
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY
})


// ###################### Create Server #######################
app.listen(process.env.PORT||8000,()=>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
    connectDb()
})