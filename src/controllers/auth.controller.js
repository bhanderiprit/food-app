import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import mongoose from "mongoose";
import sessionModel from "../models/session.model.js";
import sendEmail from "../service/email.service.js";
import otpModel from "../models/otps.model.js";
import { generateOTP, getOtpHtml } from "../utils/email.utils.js"
import foodPartnerModel from "../models/foodPartner.model.js";

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
            
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const otp = generateOTP()
        const otpHtml = getOtpHtml(otp)

        const otpHash = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex')

        await otpModel.create({
            email,
            user: user._id,
            otp : otpHash
        })

        await sendEmail(email, "otp verification", `your otp code is ${otp}`, otpHtml)


        res.status(201).json({
            message: "User created",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            },

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        },);
    }
}

async function login(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: 'user not found'
        })
    }

    const isPasswordVailed = await bcrypt.compare(password, user.password)

    if (!isPasswordVailed) {
        return res.status(400).json({
            message: 'incorrect Password'
        })
    }

    if(!user.verified){
        return res.status(400).json({message : 'email not verified'})
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT, {
        expiresIn: '7d'
    })

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
    


    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']

    })
    const accessToken = jwt.sign({
        id: user._id,
        sessionID: session._id
    }, config.JWT, {
        expiresIn: '15m'
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "User login",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        accessToken
    });

}

async function refresh(req, res) {
    const token = req.cookies.refreshToken


    if (!token) {
        return res.status(400).json({
            message: 'token require'
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, config.JWT);
    } catch (error) {
        return res.status(401).json({
            message: "invalid or expired token"
        });
    }
    if (!decoded) {
        return res.status(400).json({
            message: 'Unauthorized'
        })
    }

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({
            message: 'session revoked'
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id,
        sessionID: session._id
    }, config.JWT, {
        expiresIn: '15m'
    })

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT, { expiresIn: '7d' })

    const newRefreshTokenHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash

    await session.save()



    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: 'access token creted successfully',
        accessToken
    })


}

async function logout(req, res) {

    const token = req.cookies.refreshToken


    if (!token) {
        return res.status(400).json({
            message: 'token not found'
        })
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    const session = await sessionModel.findOne({
        refreshTokenHash: tokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({
            message: 'session not found'
        })
    }

    session.revoked = true

    await session.save()

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    return res.status(200).json({
        message: 'logged out successfully'
    })
}

async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(400).json({
            message: 'token not found'
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie('refreshToken')

    res.status(200).json({
        message: 'logout from all the device'
    })
}

async function verifyEmail(req,res){
    const {email,otp} = req.body

    if (!email || !otp){
        return res.status(400).json({
            message : 'all the filed are required'
        })
    }

    const otpHash = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex')

    const otpDoc = await otpModel.findOne({
        email,
        otp : otpHash
    })

    if(!otpDoc){
        return res.status(400).json({
            message : 'invelied otp'
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{verified : true})

    await otpModel.deleteMany({user : otpDoc.user})

    return res.status(200).json({
    message : 'email verified'
})
}

async function getMe(req, res){
    res.status(200).json({
        user: req.user
    });
}


async function registerFoodPartner(req,res){
    
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }   

        const existingFoodPartner = await foodPartnerModel.findOne({
            $or: [{ name }, { email }]
        });

        if (existingFoodPartner) {
            return res.status(400).json({
                message: "Food partner with this name or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: foodPartner._id }, config.JWT);

        res.cookie('foodPartnerToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Food partner created",
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email
            },
            token
        });

}


async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, foodPartner.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({ id: foodPartner._id }, config.JWT);

    res.cookie('foodPartnerToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Food partner logged in",
        foodPartner: {
            id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email
        },
        token
    });
}

async function logoutFoodPartner(req,res) {

    const token = req.cookies.foodPartnerToken

    if(!token){
        return res.status(400).json({
            message : 'token not found'
        })
    }

    let isTokenVelied = ''
    try {
         isTokenVelied = jwt.verify(token,process.env.JWT)

    } catch (error) {
        console.log(error);
        
    }

    if(!isTokenVelied){
        return req.status(400).json({
            message : 'token is not velied'
        })
     }
    
     res.clearCookie('foodPartnerToken')

     res.status(200).json({
        message : 'logout successfully'
     })
    
}


export { register, refresh, login, logout, logoutAll , verifyEmail , registerFoodPartner, loginFoodPartner,logoutFoodPartner,getMe};