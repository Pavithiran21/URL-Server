const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:false,
    },
    update_ts:{
        type:Date,
        default:Date.now()
    },
    isActive:{
        type:Boolean,
        default:false
    },
    activeToken:{
        type:String,
        require:false,
        
    },
    activeExpires:{type:Date}
},{
    timestamps: true
  })
module.exports = mongoose.model('users',userSchema);