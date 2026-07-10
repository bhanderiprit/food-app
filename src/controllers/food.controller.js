import foodModel from "../models/food.model.js";
import foodPartnerModel from "../models/foodPartner.model.js";
import likesModel from "../models/likes.model.js";
import uploadfile from "../service/storage.imagekit.js";
import savesModel from "../models/saveModel.js";
import commentModel from "../models/comment.model.js";


async function createFood(req,res) {
    

    const buffer = req.file.buffer
    const {foodname,price} = req.body

    const response = await uploadfile(buffer)

    const Food = await foodModel.create({
        foodname ,
        price,
        videoUrl : response.url,
        foodPartner : req.foodPartner._id

    })

    res.status(200).json({
        message: "Food created successfully",
        Food
    })
    
}

async function getAllFood(req, res) {
  try {
    const userId = req.user._id;

    const foods = await foodModel
      .find()
      .populate("foodPartner", "name")
      .sort({ createdAt: -1 });

    const likedFoods = await likesModel.find({
      user: userId,
    });

    const savedFoods = await savesModel.find({
      user: userId,
    });

    const likedFoodIds = likedFoods.map(
      (like) => like.food.toString()
    );
    

    const savedFoodIds = savedFoods.map(
      (save) => save.food.toString()
    );

    const foodsWithStatus = foods.map((food) => ({
      ...food.toObject(),
      isLiked: likedFoodIds.includes(food._id.toString()),
      isSaved: savedFoodIds.includes(food._id.toString()),
    }));

    res.status(200).json({
      message: "Foods fetched successfully",
      foods: foodsWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getFoodPartnerById(req,res) {
    const FoodPartnerId = req.params._id

    const foodPartner = await foodPartnerModel.findById(FoodPartnerId)
    const foods = await foodModel.find({foodPartner : FoodPartnerId})

    if(!foodPartner){
        return res.status(400).json({
            message : 'food partner not found'
        })
    }

    res.status(200).json({
        message : 'food partner found',
        foodPartner,
        foods
    })
}

async function likeFood(req,res) {
    const {foodId} = req.body
    const userId = req.user._id

    const isFoodLiked = await likesModel.findOne({
        food : foodId,
        user : userId
    })

    if(isFoodLiked){
        await foodModel.findByIdAndUpdate(foodId,{$inc : {likes : -1}})
        await likesModel.findOneAndDelete({
            food : foodId,
            user : userId
        })


        return res.status(200).json({
            message : 'like removed successfully'
        })
    }

    const like = await likesModel.create({
        food : foodId,
        user : userId
    })

    await foodModel.findByIdAndUpdate(foodId,{$inc : {likes : 1}})

    res.status(200).json({
        message : 'food liked successfully',
        like
    })

}

async function saveFood(req,res) {
    const {foodId} = req.body
    const userId = req.user._id

    const isFoodSaved = await savesModel.findOne({
        food : foodId,
        user : userId
    })

    if(isFoodSaved){
        await foodModel.findByIdAndUpdate(foodId,{$inc : {savesCount : -1}})
        await savesModel.findOneAndDelete({
            food : foodId,
            user : userId
        })


        return res.status(200).json({
            message : 'save removed successfully'
            
        })
    }

    const save = await savesModel.create({
        food : foodId,
        user : userId
    })

    await foodModel.findByIdAndUpdate(foodId,{$inc : {savesCount : 1}})

    res.status(200).json({
        message : 'food saved successfully',
        save
    })

}

async function getSavedFoodByUser(req,res) {
    const userId = req.user._id

    const savedFoods = await savesModel.find({user : userId}).populate('food','foodname price videoUrl foodPartner')

    if(!savedFoods || savedFoods.length === 0){
        return res.status(200).json({
            message : 'no saved foods found'
        })
    }

    res.status(200).json({
        message : 'saved foods found',
        savedFoods
    })
}

async function commentFood(req, res) {
    try {
        const userId = req.user._id;
        const { foodId, comment } = req.body;

        if (!foodId || !comment) {
            return res.status(400).json({
                message: "foodId and comment are required"
            });
        }

        const newComment = await commentModel.create({
            food: foodId,
            user: userId,
            comment
        });

        const populatedComment = await commentModel
    .findById(newComment._id)
    .populate("user", "username profilePic");

        await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { commentCount: 1 } }
        );

        res.status(201).json({
            message: "comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getAllComments(req, res) {
    try {
        const { foodId } = req.params;

        const comments = await commentModel
            .find({ food: foodId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "comments fetched successfully",
            comments
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getFoodParetner(req,res) {
    res.status(200).json({
        foodPartner : req.foodPartner
    })
}

export {createFood,getAllFood,getFoodPartnerById,likeFood,saveFood,getSavedFoodByUser,commentFood,getAllComments,getFoodParetner}