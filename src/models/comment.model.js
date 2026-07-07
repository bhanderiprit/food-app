import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "food",
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    comment : {
        type : String,
        required : true,
        trim : true,
        maxlength : 500
    }
})

const commentModel = mongoose.model('comments',commentSchema)

export default commentModel