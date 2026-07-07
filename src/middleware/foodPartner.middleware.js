import config from '../config/config.js'

import jwt from 'jsonwebtoken'
import foodpartnerModel from '../models/foodPartner.model.js'
async function authFoodPartner(req,res,next) {
    
    const token = req.cookies.foodPartnerToken || req.headers.authorization?.split(' ')[1]

    if(!token) {
        return res.status(401).json({message:'Unauthorized'})
    }

    const decoded = jwt.verify(token,config.JWT)    

    if(!decoded) {
        return res.status(401).json({message:'Invalid token'})
    }

    const foodPartner = await foodpartnerModel.findById(decoded.id)

    if(!foodPartner) {
        return res.status(401).json({message:'Food Partner not found'})
    }

    req.foodPartner = foodPartner

    next()
}

export default authFoodPartner