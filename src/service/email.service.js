import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:config.GOOGLE_USER,
        clientId:config.GOOGLE_CLINT_ID,
        clientSecret:config.GOOGLE_CLINT_SECRET,
        refreshToken:config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Email transporter is ready to send emails");
    }
})

export const sendEmail = async (to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
            from:config.GOOGLE_USER,
            to,
            subject,
            text,
            html
        });
        console.log("Email sent successfully %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export default sendEmail