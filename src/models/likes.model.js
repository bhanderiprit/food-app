import mongoose from "mongoose";

const likesSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    food : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    }
})

const likesModel = mongoose.model('likes',likesSchema)

export default likesModel