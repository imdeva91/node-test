const express = require("express")

const app = express()
const port = 5000

app.get('/',(req,res)=>{
res.send("hello world")
})

app.listen(port,()=>{
    console.log(`server is runing on port ${port}`)
})