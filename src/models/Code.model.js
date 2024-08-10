const { ref } = require("joi");

const codeSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter your fullname'],
        minlength: [3, "Fullname must be at least 3 characters"],
        
    },
    description: {
        type: String,
       
    },

    code: {
        type: String,
        
    },
  
    isPrivate: {
        type: Boolean,
        default: false
    },
  language: {
    type:String,
    required: [true, 'Please enter your fullname'],

  },
  user_id:{
    ref:'user',
    type:mongoose.SchemaTypes.ObjectId,
    required: true
  }
   


}, { timestamps: true })

const CodeModel = mongoose. model('code', codeSchema)
module.exports=CodeModel;