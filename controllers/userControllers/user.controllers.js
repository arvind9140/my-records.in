import usersModels from "../../models/users.models.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { onlyAddressValidation, onlyAlphabetsValidation, onlyBloodGroupValidation, onlyDateOfBirthValidation, onlyEmailValidation, onlyNumberValidation, onlyPasswordPatternValidation, } from "../../utils/validation.js";
// import twilio from 'twilio';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

async function generateAccessToken(userId, phone){

   return jwt.sign({ userId: userId, phone:phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}
async function generateRefreshToken(userId, phone){
return jwt.sign({ userId: userId, phone:phone }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}


export const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await usersModels.findById(userId)
        if(user)
        {
            const accessToken = await generateAccessToken(userId,user.MobileNumber)
            const refreshToken = await  generateRefreshToken(userId, user.MobileNumber)

            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })

            return { accessToken, refreshToken }
        }
        else {
            throw new ApiError(404, "User not found")
        }
       


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}




export const sendOtp = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const dob = req.body.dob;
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const blood_group = req.body.blood_group;
    const address = req.body.address;
    const pincode = req.body.pincode;
    const occupation = req.body.occupation;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  


    if (!onlyAlphabetsValidation(name) && name.length > 2) {
        throw new ApiError(400, "Name should contain only alphabets and length should be greater than 2");
    }
    else if (!onlyDateOfBirthValidation(dob)) {
        throw new ApiError(400, "Date of birth should be in DD-MM-YYYY format");
    }

    else if (email) {
        if (!onlyEmailValidation(email)) {
            throw new ApiError(400, "Email should be in correct format");
        }
    }
    else if (!onlyNumberValidation(phone) || phone.length !== 10) {
        throw new ApiError(400, "Phone number should be in correct");
    }
    else if (!onlyAlphabetsValidation(gender) && gender.length > 2) {
        throw new ApiError(400, "Gender should contain only alphabets and length should be greater than 2");
    }
    
    else if(!onlyBloodGroupValidation(blood_group))
    {
        throw new ApiError(400, "Blood group should contain only alphabets and length should be greater than 2");
    }
    else if(!onlyAddressValidation(address))
    {
        throw new ApiError(400, "Address should contain all alphabets, digit, slash"); 
    }
    else if(address.length > 5)
    {
        throw new ApiError(400, "Address should contain minimum 5 length");
    }
  
    else if (!onlyNumberValidation(pincode) || pincode.length !== 6) {
        throw new ApiError(400, "Pincode should be in correct format");

    }
    else if (occupation) {
        if (!onlyAlphabetsValidation(occupation)) {
            throw new ApiError(400, "Occupation should contain only alphabets");
        }
    }
    else if (!onlyPasswordPatternValidation(password)) {
        throw new ApiError(400, "Password should contain at least one uppercase letter, one lowercase letter, one special character, and one number and minimum length is 8 ");
    } 
    else if (!(password === confirmPassword)) {
        throw new ApiError(400, "Password and Confirm Password should be same");

    }
    else {
        const check_phone = await usersModels.findOne({ MobileNumber: phone })
        if (check_phone) {
            throw new ApiError(400, "Phone number already exists");
        }

        const hashPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = new usersModels({
            Name: name,
            DOB: dob,
            Gender: gender,
            Blood_Group: blood_group,
            MobileNumber: phone,
            Password: hashPassword,
            Email: email,
            Status: true,
            occupation: occupation,
            Address: {
                address: address,
                pincode: pincode,
               
            },

        })
        await user.save();
        const response = new ApiResponse(
            200,
            [],
            "User registered Successfully"
        )
        res.status(response.statusCode).json({
            success: response.success,
            data: response.data,
            message: response.message
        });
        // const otp = Math.floor(100000 + Math.random() * 900000);
        // const currentDateTimeString = new Date;
        // const uniqueIdentifier = `${phone}-${otp}`;

        // const hash = crypto.createHash('sha256').update(uniqueIdentifier).digest('hex');




        // const accountSid = process.env.ACCOUNTSID;
        // const authToken = process.env.AUTHTOKEN;
        // const client = twilio(accountSid, authToken);

        // client.messages
        //     .create({
        //         from: process.env.FROMPHONE,
        //         to: '+91' + phone,
        //         body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        //     })
        //     .then(message => {

        //         const response = new ApiResponse(
        //             200,
        //             { "hash": hash, "time": currentDateTimeString },
        //             "Send OTP successfully"
        //         )
        //         res.status(response.statusCode).json({
        //             success: response.success,
        //             data: response.data,
        //             message: response.message
        //         });

        //     })
        //     .catch(err => {
        //         console.error(err);
        //         throw new ApiError(400, "Failed to send OTP");

        //     });
    }

})


export const verifyOtp = asyncHandler(async (req, res) => {
    const otp = req.body.otp;
    const hash = req.body.hash;
    const time = req.body.time;
    const name = req.body.name;
    const dob = req.body.dob;
    const blood_group = req.body.blood_group;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const locality = req.body.locality;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const occupation = req.body.occupation;
    const password = req.body.password;


    if (!onlyAlphabetsValidation(name) && name.length > 2) {
        throw new ApiError(400, "Name should contain only alphabets and length should be greater than 2");
    }
    else if (!onlyDateOfBirthValidation(dob)) {
        throw new ApiError(400, "Date of birth should be in DD-MM-YYYY format");
    }

    else if (email) {
        if (!onlyEmailValidation(email)) {
            throw new ApiError(400, "Email should be in correct format");
        }
    }
    else if (!onlyAlphabetsValidation(gender) && gender.length > 2) {
        throw new ApiError(400, "Gender should contain only alphabets and length should be greater than 2");
    }
    else if (!onlyBloodGroupValidation(blood_group)) {
        throw new ApiError(400, "Blood group should contain only alphabets and length should be greater than 2");
    }
    else if (!onlyAddressValidation(address)) {
        throw new ApiError(400, "Address should contain all alphabets, digit, slash");
    }
    else if (!locality) {
        throw new ApiError(400, "Locality is required");

    }
    else if (!onlyAlphabetsValidation(city)) {
        throw new ApiError(400, "City should contain only alphabets");
    }
    else if (!onlyAlphabetsValidation(state)) {
        throw new ApiError(400, "State should contain only alphabets");
    }
    else if (!onlyNumberValidation(pincode) && pincode.length == 6) {
        throw new ApiError(400, "Pincode should be in correct format");

    }
    else if (occupation) {
        if (!onlyAlphabetsValidation(occupation)) {
            throw new ApiError(400, "Occupation should contain only alphabets");
        }
    }
    else if (!onlyPasswordPatternValidation(password) && password.length >= 8) {
        throw new ApiError(400, "Password should contain atleast one uppercase, one lowercase, one special character and one number");
    }

    else if (!onlyNumberValidation(otp) || otp.length !== 6) {
        throw new ApiError(400, "OTP should be in correct format");
    }
    else if (!onlyNumberValidation(phone) || phone.length !== 10) {
        throw new ApiError(400, "Phone number should be in correct format");
    }
    else if (!hash && !time) {
        throw new ApiError(400, "Hash and time  are required");
    }
    else {
        const currentDate = new Date();
        const otherDate = new Date(time);
        const difference = Math.abs(currentDate.getTime() - otherDate.getTime());
        const differenceInMinutes = difference / (1000 * 60);

        if (differenceInMinutes <= 5) {
           
            const uniqueIdentifier = `${phone}-${otp}`;

            const makeHash = crypto.createHash('sha256').update(uniqueIdentifier).digest('hex');
           
            if (makeHash === hash) {

                const hashPassword = crypto.createHash('sha256').update(password).digest('hex');
                
                const user = new usersModels({
                    Name: name,
                    DOB: dob,
                    Gender: gender,
                    Blood_Group:blood_group,
                    MobileNumber: phone,
                    Password: hashPassword,
                    Email: email,
                    Status: true,
                    occupation: occupation,
                    Address: {
                        address:address,
                        locality: locality,
                        city: city,
                        pincode: pincode,
                        state: state,
                    },
                    
                })
                await user.save();
                const response = new ApiResponse(
                    200,
                    [],
                    "User registered Successfully"
                )
                res.status(response.statusCode).json({
                    success: response.success,
                    data: response.data,
                    message: response.message
                });
            }
            else{
                throw new ApiError(400, "Invalid Otp");

            }

        } else {
            throw new ApiError(400, "Invalid Otp");

        }

    }
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await usersModels.findById(decodedToken?.userId)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export const getUserData = asyncHandler(async (req, res)  =>{
    const userId = req.params.id;
    const user = await usersModels.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    if(user.Status === false)
    {
        throw new ApiError(404, "User not found")
    }
    const response = {
        name: user.Name,
        email: user.Email,
        phone: user.MobileNumber,
        gender: user.Gender,
        dob: user.DOB,
        profilePic: user.userProfile,
        blood_group:user.Blood_Group,
        occupation:user.occupation,
        address:user.Address,



    }
    return res.status(200).json(new ApiResponse(200, response, "User data fetched"))

})





