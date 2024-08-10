const Joi=require('joi')
const ErrorHandler=require('../utils/ErrorHandler.utils.js')
 const LoginValidator=(req,res,next)=>{
    const schema=Joi.object().keys({
        email:Joi.string().email().messages({ 
            "any.required": "Please enter email" ,
            'string.base':"email must be string",
            'string.email':"Please enter valid email"
        }),
        password:Joi.string().required().messages({ 
            "any.required": "Please enter password",
            "string.base":"password must be string"
         }),
    })
    const {error}=schema.validate(req.body,{abortEarly:false})
    if(error){
        return next(new ErrorHandler(error?.message, 400))

    }else{
        next()

    }



}

module.exports=LoginValidator