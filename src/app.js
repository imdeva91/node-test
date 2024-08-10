const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser');
const userRoute=require('./routes/User.route')
const codeRoute=require('./routes/Code.route .js')

const  ErrorMiddleware  =require('./middleware/Error.middleware.js')
const app=express()


// Add body parser and add limit 
app.use(express.json({limit:'50mb'}))

// Cookie parser 
app.use(cookieParser())

// Add cors policies ..........
app.use(cors())
// app.use(cors({
//     origin:process.env.ORIGIN||['http://localhost:3000']
// }))



// route ................... 


app.use('/user',userRoute)
app.use('/code',codeRoute)

// Test api ....
app.get('/',async(req,res,next)=>{

    try {
       res.status(200).json({
        success:true,
        message:'working fine'
       }) 
    } catch (error) {
        res.status(500).json({
            status:false,
            message:error.message
        })


        
    }


})


// Unknown route .....
app.all('*',(req,res,next)=>{
    const err=new Error(`Route ${req.originalUrl} not found`) ;
    err.statusCode=404
    next(err)
})



// Error Middleware .....
app.use(ErrorMiddleware)

module.exports=app