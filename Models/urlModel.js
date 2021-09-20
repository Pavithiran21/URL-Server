const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: true,
    },
    longUrl :{
        type : String,
        required : true,
    },
    shortUrl : {
        type : String,
        required : true,
    },
    date : {
        type: String,
        required : true,
        default : Date.now,
    },
    created_date : {
        type: String,
        required : false,
        default : Date.now,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
      },
    created_by : {
        type : String,
        required : false,
    },
    updated_by : {
        type : String,
        required : false,
    },

});
module.exports = mongoose.model('url',UrlSchema);