import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
    foodname :{
        type: String,
        required: true,
    },
    price :{
        type: Number,
        required: true,
    },
    videoUrl :{
        type: String,
        required: true,
    },
    foodPartner :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "food-partner",
        required: true
    },
    likes : {
        type: Number,
        default: 0
    },
    savesCount : {
        type: Number,
        default: 0
    },
    commentCount :{
        type : Number,
        default : 0
    }
},{
    timestamps : true
})

const foodModel = mongoose.model('food',foodSchema)

export default foodModel