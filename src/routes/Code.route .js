const express=require('express')
const {  isAuthenticated }=require('../middleware/Auth.middleware.js');
const {createCode,updateCode,deleteCode,personalCode,publicCode} =require("../controllers/Code.controller.js")
const codeRoute = express.Router()

codeRoute.post('/create',isAuthenticated,createCode )
codeRoute.put('/update/:id',isAuthenticated,updateCode )
codeRoute.delete('/delete/:id',isAuthenticated,deleteCode )
codeRoute.get('/personal-code',isAuthenticated,personalCode )
codeRoute.get('/public-all-code',isAuthenticated,publicCode )




module.exports=codeRoute;
