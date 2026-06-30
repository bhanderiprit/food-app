export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
      </head>
      <body>
        <h2>Your OTP is: ${otp}</h2>
        <p>Please use this code to verify your email address.</p>
      </body>
    </html>`;
 }