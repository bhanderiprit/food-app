import express from 'express'
import  {createFood, getAllFood, getFoodPartnerById, getSavedFoodByUser,likeFood,commentFood, getAllComments}  from '../controllers/food.controller.js'
import authFoodPartner from '../middleware/foodPartner.middleware.js'
import UserAuth from '../middleware/UserAuth.middleware.js'
import { saveFood } from '../controllers/food.controller.js'

import multer from 'multer'

const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed."));
        }

    }
});
router.post('/',authFoodPartner,upload.single('video'),createFood)
router.get('/getAllFood',UserAuth,getAllFood)
router.get('/profile/:_id',getFoodPartnerById)
router.post('/like',UserAuth,likeFood)
router.post('/save',UserAuth,saveFood)
router.get('/getSavedFood',UserAuth,getSavedFoodByUser),
router.post('/comment',UserAuth,commentFood)
router.get('/getAllComments/:foodId',UserAuth,getAllComments)


export default router