const mongoose = require('mongoose')

const buildingModel = mongoose.Schema({
    title: {type:String},
    detail : {type:String},
    image : {type:Object},
    isImgDel : {
        type : Boolean,
        default : false,
    }
}, {
    timestamps: true,
})

const building = mongoose.model('building', buildingModel)
module.exports =  building;