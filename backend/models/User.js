const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
        email:{type:String, required:true, unique:true},
        username:{type: String, required:true},
        password:{type: String, required: true}, 
        userAvatar : {type:String, required :true, default : "https://www.rphfm.org/wp-content/uploads/2016/08/avatar-anonyme.gif"}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)