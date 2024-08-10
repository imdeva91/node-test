const express=require('express')
const {registrationUser,activateUser,loginUser,logoutUser}=require('../controllers/User.controller.js');
const {  isAuthenticated }=require('../middleware/Auth.middleware.js');
const LoginValidator=require('../validator/Login.validator.js')
const userRoute = express.Router()

userRoute.post('/registration', registrationUser)
userRoute.post('/activate-user', activateUser)
userRoute.post('/login',LoginValidator, loginUser)
// userRoute.post('/social-auth', socialAuth)

userRoute.get('/logout', isAuthenticated, logoutUser)
// userRoute.get('/refresh-token', isAuthenticated, updateAccessToken)
// userRoute.get('/me', isAuthenticated, getUserInfo)
// userRoute.put('/update-user-info', isAuthenticated, updateUserInfo)
// userRoute.put('/change-password', isAuthenticated, updatePassword)
// userRoute.put('/update-profile-pic', isAuthenticated, updateAvatar)






module.exports=userRoute;
