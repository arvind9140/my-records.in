import nodemailer from "nodemailer";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import dotenv from "dotenv";
import { onlyAlphabetsValidation, onlyEmailValidation, onlyNumberValidation } from "../../utils/validation.js";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.API_KEY,
    },
});

export const contactUs = asyncHandler(async (req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    if(!onlyAlphabetsValidation(fullName) )
    {
        return new ApiError(400, 'please enter correct name')
    }
    else if(!onlyEmailValidation(email))
    {
        return new ApiError(400, 'please enter correct email')
    }
    else if(!onlyNumberValidation(phone) || phone.length !=10)
    {
        return new ApiError(400, 'please enter correct phone number')
    }
    else{
        const mailOptions = {
            from: email,
            to: 'rmaurya@initializ.io',
            subject: 'New Query From My-Records.in',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>The HTML5 Herald</title>
                <meta name="description" content="The HTML5 Herald">
                <meta name="author" content="SitePoint">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <link rel="stylesheet" href="css/styles.css?v=1.0">
            </head>
            <body>
                <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';"></div>
                <div class="container" style="margin-left: 20px;margin-right: 20px;">
                    <h3>You've got a new mail from ${fullName}, their email is: ✉️${email} and phone is :📞${phone} </h3>
                    <div style="font-size: 16px;">
                        <p>Message:</p>
                        <p>${message}</p>
                        <br>
                    </div>
                </div>
            </body>
            </html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                const apiError = new ApiError(500, 'Failed to send email',);

            } else {

                const responses = new ApiResponse(
                    200,
                    [],
                    "Email sent successfully"
                )

                res.status(responses.statusCode).json({
                    success: responses.success,
                    data: [],
                    message: responses.message
                });
            }
        });

    }

   
});
