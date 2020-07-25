const mongoose = require('mongoose');


const campgroundSchema = new mongoose.Schema({
    name: String,
    price : String,
    image: String,
    description: String,
    author :{
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : "string"
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
});

module.exports = mongoose.model('campground',campgroundSchema);