const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userAvatar: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date(),
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl:{
        type:String,
    },
    likers: {
        type: Array,
        required: true,
        default: [],
    },
    comments: {
        type: Array,
        required: true,
        default: [],
    },
});

module.exports = mongoose.model('Post', postSchema);
