import express from 'express'
import {register,refresh,login, logout, logoutAll ,verifyEmail,registerFoodPartner,loginFoodPartner, logoutFoodPartner ,getMe} from '../controllers/auth.controller.js'
import UserAuth from '../middleware/UserAuth.middleware.js'
import authFoodPartner from '../middleware/foodPartner.middleware.js'
import { getFoodParetner } from '../controllers/food.controller.js'
import {otpLimiter} from '../middleware/rateLimit.js'

const router = express.Router()

router.post('/user/register', otpLimiter, register)
router.post('/user/refresh',refresh)
router.post('/user/login',login)
router.get('/user/logout',logout)
router.get('/user/logoutAll',logoutAll)
router.post('/user/verifyEmail/:id',verifyEmail)
router.get('/user/me', UserAuth, getMe);



router.post('/foodPartner/register',registerFoodPartner)
router.post('/foodPartner/login',loginFoodPartner)
router.get('/foodPartner/logout',logoutFoodPartner)
router.get('/foodPartner/getFoodPartner',authFoodPartner,getFoodParetner)


export default router