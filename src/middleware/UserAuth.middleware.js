import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'


async function AuthUser(req,res,next) {
    const token = req.cookies.refreshToken || req.headers.authorization?.split(' ')[1]


if(!token) {
    return res.status(401).json({message:'Unauthorized'})
}

const decoded = jwt.verify(token,config.JWT)

if(!decoded) {
    return res.status(401).json({message:'Invalid token'})}

    const user = await userModel.findById(decoded.id)

    if(!user) {
        return res.status(401).json({message:'User not found'})
    }

    req.user = user
    next()

}

export default AuthUser



