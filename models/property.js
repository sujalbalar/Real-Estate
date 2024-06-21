import mongoose from "mongoose";

const propertySchema = mongoose.Schema({
    state : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    size : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },
    rent : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    imgUrl : {
        type : String,
        required : true
    },
    agent : {
        type : String,
        required : true
    }
});

const propertyModel = mongoose.model('properties',propertySchema);

export default propertyModel;