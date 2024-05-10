const express = require("express");

// Models :
const authh = require("../../model/loginModel");

// Helpers :
const jwt = require("../../utils/jwt")
const bycrypt = require("../../utils/bycrypt");
const SendEmail = require("../../utils/emails/sendEmail");
const crypto = require("crypto");
const catchAsync = require("../../utils/catchAsync");
const { STATUS_CODE, ERRORS, SUCCESS_MSG } = require("../../constants/index")



const signup = async (req, res) => {

    const signup = req.body;
    try {
        const newUser = new authh(signup)
        let result = await newUser.save()
        res.status(STATUS_CODE.OK).json({ message : SUCCESS_MSG.SUCCESS_MESSAGES.CREATED, result: result });
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

const login = catchAsync(async (req, res) => {
    let { email, password } = req.body
    try{
    if (!email || !password) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: `${!email ? "Email" : "Password"} is required.` });
        
    }
    const doc = await authh.findOne({ email: email, password: password })
    if (doc) {
        const token = jwt.createJWT(doc)
        if (token) {
            doc.token = token;
        }
        return res.status(STATUS_CODE.OK).json({ result: doc, message : SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS });
        
    }
    res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Invalid email and password" });
    return;
}
 catch (err) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err });

    }
})

module.exports = {signup, login}