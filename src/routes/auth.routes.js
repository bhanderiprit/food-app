import express from 'express'
import {register,refresh,login, logout, logoutAll ,verifyEmail} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register',register)
router.post('/refresh',refresh)
router.post('/login',login)
router.get('/logout',logout)
router.get('/logoutAll',logoutAll)
router.get('/verifyEmail',verifyEmail)


export default router