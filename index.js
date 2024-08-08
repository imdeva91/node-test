const { default: axios } = require("axios")
const express = require("express")
const cron = require('node-cron')
const app = express()
const port = 5000

app.get('/',(req,res)=>{
res.send("hello world")
})

app.listen(port,()=>{
    console.log(`server is runing on port ${port}`)
})

async function generateTargetReports(){
    try {
        const data=await axios.get('https://onlinecompiler-backend.onrender.com/user/test')
        console.log('data',data)
        
    } catch (error) {
        console.log('error',error)
        
    }
}


cron.schedule('*/30 * * * * *', generateTargetReports)