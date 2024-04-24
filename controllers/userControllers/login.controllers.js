import usersModels from "../../models/users.models.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessAndRefereshTokens } from "./user.controllers.js";
import crypto from 'crypto';




export const loginUser = asyncHandler(async (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
const user = await usersModels.findOne({ MobileNumber: phone})
if(!user)
{
    throw new ApiError(404, "User not found");
}
    const check_password = crypto.createHash('sha256').update(password).digest('hex');
 if(user.Password!==check_password)
{
    throw new ApiError(400, "Invalid password");
}
else{
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id,user.MobileNumber)
  

    const loggedInUser = await usersModels.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: user._id, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
}
    
})





export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.body.id;
    await usersModels.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})
