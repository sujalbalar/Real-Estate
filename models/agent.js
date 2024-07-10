import mongoose from "mongoose";

const agentSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const agentModel = mongoose.model('agents', agentSchema);

export default agentModel;