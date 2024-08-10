const ErrorHandler=require('../utils/ErrorHandler.utils.js')
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';


    // wrong mongodb id .....
    if (err.name == 'CastError') {
        const message = `Resources not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key Error .........
    if (err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400)
    }


    if (err.name == 'TokenExpiredError') {
        const message = 'Json web token is expired, try again';
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

module.exports=ErrorMiddleware;