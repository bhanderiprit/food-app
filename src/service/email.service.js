// import nodemailer from "nodemailer";
// import config from "../config/config.js";

// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         type:"OAuth2",
//         user:config.GOOGLE_USER,
//         clientId:config.GOOGLE_CLINT_ID,
//         clientSecret:config.GOOGLE_CLINT_SECRET,
//         refreshToken:config.GOOGLE_REFRESH_TOKEN
//     }
// })

// transporter.verify((error,success)=>{
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Email transporter is ready to send emails");
//     }
// })

// export const sendEmail = async (to,subject,text,html)=>{
//     try {
//         const info = await transporter.sendMail({
//             from:config.GOOGLE_USER,
//             to,
//             subject,
//             text,
//             html
//         });
//         console.log("Email sent successfully %s", info.messageId);
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw error;
//     }
// }

// export default sendEmail



import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail(to, subject, text, html) {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw error;
  }

  console.log("Email sent successfully");
}