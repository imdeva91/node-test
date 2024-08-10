const CatchAsyncError=require("../middleware/CatchAsyncError.middleware.js");
const ErrorHandler=require('../utils/ErrorHandler.utils.js')
const CodeModel =require('../models/Code.model.js')


const createCode = CatchAsyncError(async (req, res, next) => {
    const body={...req.body,user_id:req.user._id}
    const code=await CodeModel.create(body)
   
    res.status(201).json({
        success: true,
        message:'Code save successfully.',
       data:code
    })
}
)
const updateCode = CatchAsyncError(async (req, res, next) => {
    const paramId=req.params.id

    const code=await CodeModel.findByIdAndUpdate(paramId,req.body,{new:true})
   
    res.status(201).json({
        success: true,
        message:'Updated code successfully.',
       data:code
    })
}
)
const deleteCode = CatchAsyncError(async (req, res, next) => {
    const paramId=req.params.id
    const code=await CodeModel.findByIdAndDelete(paramId)
   
    res.status(201).json({
        success: true,
        message:'Code deleted successfully.',
       data:code
    })
}
)

const personalCode = CatchAsyncError(async (req, res, next) => {
    const code=await CodeModel.find({user_id:req.user._id}).populate('user')
   
    res.status(201).json({
        success: true,
        message:'Find successfully.',
       data:code
    })
}
)
const publicCode = CatchAsyncError(async (req, res, next) => {
    const code=await CodeModel.find({isPrivate:false}).populate('user')
   
    res.status(201).json({
        success: true,
        message:'Find successfully.',
       data:code
    })
}
)



module.exports={createCode,updateCode,deleteCode,publicCode,personalCode}