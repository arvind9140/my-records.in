import mongoose from "mongoose";

const Users = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    DOB:{
        type: String,
        required: true,

    },
    Gender: {
        type: String,
        required: true,

    },
    MobileNumber: {
        type: String,
        required: true,

    },
    Password:{
        type: String,
        required: true,

    },
    Blood_Group:{
        type: String,
        required: true,
    },

    Email: {
        type: String,
        required: false,
    },
    Status: {
        type: Boolean,
        required: true,
    },

  userProfile: {
        type: String,
        // required:true,
    },

    Address: [],

    occupation:{
    type: String,
    required: false,
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model("users", Users, "users");
