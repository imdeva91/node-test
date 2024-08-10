



 const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10)
 const refreshTokenExpire = parseInt(process.env.REFRESS_TOKEN_EXPIRE || '59', 10)
// option for cookies ........
 const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
}
 const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 60 * 1000),
    maxAge: refreshTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
}
 const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();



    if (process.env.NODE_ENV == 'production') {
        accessTokenOptions.secure = true;
    }
    res.cookie('access_token', accessToken, accessTokenOptions)

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        message: 'Login Successfully.'
    })


}
module.exports={
    accessTokenExpire,
    refreshTokenExpire,
    refreshTokenOptions,
    accessTokenOptions,
    sendToken

}