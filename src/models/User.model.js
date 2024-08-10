const mongoose =require('mongoose')
const bcrypt =require('bcryptjs')
const {emailRegexPattern}=require("../utils/Regex.utils.js")
const jwt =require('jsonwebtoken')

const userSchema= new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please enter your fullname'],
        minlength: [3, "Fullname must be at least 3 characters"],
        
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value)
            },
            message: 'Please enter a valid email.'
        },
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Please enter your password'],

        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
  terms_conditions: {
    type:Boolean,
    default:false
  }
   


}, { timestamps: true })






// Hash password before saving ..............
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()

})


// Compare Password ............................

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}


// Sign Access Token ......
userSchema.methods.SignAccessToken=function(){
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN ,{
        expiresIn:"30d"
    })
}

// Sign Refress Token ......
userSchema.methods.SignRefreshToken=function(){
    return jwt.sign({id:this._id},process.env.REFRESS_TOKEN ,{
        expiresIn:'3d'
    })
}


 const UserModel = mongoose. model('User', userSchema)
 module.exports=UserModel;





