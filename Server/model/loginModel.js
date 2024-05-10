const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    profileImage: {
        type: Object,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
        // lowercase: true,
        // required: [true, "Email is required"],
        // validate: [validator.isEmail, "Invalid Email"],
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female"],
            message: "Gender must be male OR female",
        },
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin" , "superAdmin"],
            message: "Role must be admin , user OR superAdmin",
        },
        default : "user",
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "created", "approved", "banned"],
            message: "Status must be pending , created , approved , OR banned",
        },
        default: "approved"
    },
    token: {
        type: String,
        default : null,
    },

}, {
    timestamps: true,
})

const authh = mongoose.model('auth', userSchema)

module.exports =  authh;