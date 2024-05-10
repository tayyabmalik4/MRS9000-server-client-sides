const mongoose = require('mongoose')

const departmentModel = mongoose.Schema({
    title: {type:String},
    detail : {type:String},
    image : {type:Object},
    isImgDel : {
        type : Boolean,
        default : false,
    },
    buildingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'building'
    }
}, {
    timestamps: true,
})

const department = mongoose.model('department', departmentModel)
module.exports =  department;