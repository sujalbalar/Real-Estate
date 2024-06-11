import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true  
    },
    password : {
        type : String,
        required : true
    }
});

const userModel = mongoose.model('users',userSchema);

export default userModel;