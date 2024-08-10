
// ################################### Authenticate User #########################################
const CatchAsyncError=require('./CatchAsyncError.middleware.js');
const ErrorHandler=require('../utils/ErrorHandler.utils.js')
const jwt =require('jsonwebtoken')
// import { radis } from "../utils/RadisConfig.utils.js";
const UserModel=require('../models/User.model.js')

 const isAuthenticated = CatchAsyncError(async (req, res, next) => {
    try {
        const access_token = req.cookies.access_token ;
        if (!access_token) {
            return next(new ErrorHandler('Please login to access this resource', 401))
        }
        const decode = jwt.verify(access_token, process.env.ACCESS_TOKEN ) ;
        if (!decode) {
            return next(new ErrorHandler("Access token is not valid", 401));
        }

        const user = await  UserModel.findById(decode.id) 
    
        if (!user) {
            return next(new ErrorHandler('Access token is not valid', 401))
        }
        req.user = user
        next()

    } catch (error) {
        return next(new ErrorHandler(error.message, 401))
    }

})

// ############################### Validate User Role ######################################
 const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?._id)) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403))
        }
        next()
    }
}

module.exports={authorizedRoles,isAuthenticated}