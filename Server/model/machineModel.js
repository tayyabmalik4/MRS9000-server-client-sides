const mongoose = require('mongoose')

const machineModel = mongoose.Schema({
    title: {type:String},
    detail : {type:String},
    image : {type:Object},
    isImgDel : {
        type : Boolean,
        default : false,
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'department'
    },
    buildingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'building'
    }
}, {
    timestamps: true,
})

const machine = mongoose.model('machine', machineModel)
module.exports =  machine;