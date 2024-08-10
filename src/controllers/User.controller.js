const CatchAsyncError=require("../middleware/CatchAsyncError.middleware.js");
const ErrorHandler=require('../utils/ErrorHandler.utils.js')
const jwt=require('jsonwebtoken')
const ejs=require('ejs')
const UserModel=require('../models/User.model.js')
const path=require('path');
const sendEmail=require('../utils/SendMail.utils.js')
const {accessTokenOptions, refreshTokenOptions, sendToken}=require("../utils/Jwt.utils.js")
// import { radis } from "../utils/RadisConfig.utils.js";
// import { getUserById } from "../services/User.service";
// import {v2 as cloudinary} from 'cloudinary'


// ############################ Register User #########################################
 const registrationUser = CatchAsyncError(async (req, res, next) => {
    const { fullname, email, password, terms_conditions,username } = req.body ;
    const isEmailExist = await UserModel.findOne({ email })
    if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400))
    }
    const user = { fullname, email, password, terms_conditions };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode }
    await sendEmail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data
    })
    res.status(201).json({
        success: true,
        message: `Please check your mail: ${user.email} to activate your account`,
       token: activationToken.token
    })
}
)



//  ################################## Create Activation Token ####################################

 const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET , {
        expiresIn: '5m'
    })
    return { activationCode, token }
}




// ############################### Activate User ###############################################

 const activateUser = CatchAsyncError(async (req, res, next) => {

    const { activation_token, activation_code } = req.body ;
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)
    if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation Code', 400))
    }
    const { fullname, email, password, terms_conditions,username } = newUser.user;
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
        return next(new ErrorHandler('Email already exist', 400))
    }
  const user=  await UserModel.create({ fullname, email, password, terms_conditions,username});
    sendToken(user, 200, res)
})


// // ################################ Login User ############################################
 const loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body ;
    
    const user = await UserModel.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400))
    }
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
        return next(new ErrorHandler('Invalid email or password', 400))

    }

    sendToken(user, 200, res)
})


// // ################################# Logout user #######################################

 const logoutUser = CatchAsyncError(async (req, res, next) => {
    res.cookie('access_token', '', { maxAge: 1 })
    res.status(200).json({
        success: true,
        message: "Logout Successfully."
    })
})


// // ##################################### Refresh token #########################################
// export const updateAccessToken = CatchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
//     const refresh_token = req.cookies.refresh_token as string;
//     const decoded = jwt.verify(refresh_token, process.env.REFRESS_TOKEN as string) as JwtPayload;
//     if (!decoded) {
//         return next(new ErrorHandler('Could not refresh token', 400));
//     }
//     const session = await radis.get(decoded.id as string);
//     if (!session) {
//         return next(new ErrorHandler('Could not refresh token', 400))
//     }
//     const user = JSON.parse(session);
//     const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
//         expiresIn: '5m'
//     })
//     const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESS_TOKEN as string, {
//         expiresIn: '3d'
//     })
//     res.cookie('access_token', accessToken, accessTokenOptions)
//     res.cookie('refresh_token', refreshToken, refreshTokenOptions)
//     req.user = user;
//     res.status(200).json({
//         success: true,
//         accessToken
//     })
// })


// // #############################  Get User Info ##############################################
// export const getUserInfo = CatchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response) => {
//     const userId = req.user?._id;
//     getUserById(userId, res)

// })


// // ############################# Social Auth ##############################################

// export const socialAuth = CatchAsyncError(
//     async (req: Request, res: Response) => {
//         const { email, name, avatar } = req.body as ISocialAuthBody;
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             const newUser = await UserModel.create({ email, name, avatar })
//             sendToken(newUser, 200, res)
//         } else {
//             sendToken(user, 200, res)
//         }
//     }
// )


// // ###################### Update user info ######################################

// export const updateUserInfo = CatchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

//     const { name, email } = req.body as IUpdateUserInfo;
//     const userId = req.user?._id;
//     const user = await UserModel.findById(userId);
//     if (email && user) {
//         const isEmailExist = await UserModel.findOne({ email })
//         if (isEmailExist) {
//             return next(new ErrorHandler('Email already exist', 400))
//         }
//         user.email = email;
//     }
//     if (name && user) {
//         user.name = name;
//     }
//     await user?.save();
//     await radis.set(userId, JSON.stringify(user));
//     res.status(200).json({
//         success: true,
//         user
//     })


// })


// // ############################ Update Password ##################################
// export const updatePassword = CatchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
//     const { newPassword, oldPassword } = req.body as IUpdatePassword;
//     if(!newPassword ||!oldPassword){
//         return next(new ErrorHandler('Please enter old password and new password',400))
//     }
//     const user = await UserModel.findById(req.user?._id).select('+password')
//     if (user?.password === undefined) {
//         return next(new ErrorHandler('Invalid User', 400))

//     }
//     const isPasswordMatch = await user?.comparePassword(oldPassword)
//     if (!isPasswordMatch) {
//         return next(new ErrorHandler('Invalid old password', 400))
//     }
//     user.password = newPassword;
//     await user.save()
//     await radis.set(req.user?._id,JSON.stringify(user))
//     res.status(201).json({
//         success: true,
//         user
//     })

// })

// // ########################### Update Profile Picture ##############################
// export const updateAvatar=CatchAsyncError(async(req:IGetUserAuthInfoRequest,res:Response,next:NextFunction)=>{
//     const {avatar}=req.body as IUpdateAvatar;
//     const userId=req.user?._id
//     const user=await UserModel.findById(userId);
//     if(avatar && user){
//         if(user?.avatar?.public_id){
//             await cloudinary.uploader.destroy(user.avatar?.public_id);
//             const myCloud=await cloudinary.uploader.upload(avatar,{
//                 folder:'avatar',
//                 width:150
//             })
//             user.avatar={public_id:myCloud.public_id,url:myCloud.secure_url}
//         }else{
//             const myCloud=await cloudinary.uploader.upload(avatar,{
//                 folder:'avatar',
//                 width:150
//             })
//             user.avatar={public_id:myCloud.public_id,url:myCloud.secure_url}
//         }

//     }
//     await user?.save()
//     await radis.set(userId,JSON.stringify(user));
//     res.status(200).json({
//         success:false,
//         user
//     })
// })

module.exports={registrationUser,createActivationToken,activateUser,loginUser,logoutUser}
