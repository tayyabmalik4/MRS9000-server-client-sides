const mongoose = require('mongoose')

const deviceModel = mongoose.Schema({
    title: {
        type:String,
    },
    MQTT_ID : {
        type : String,
    },
    Device_ID : {
        type : String,
    },
    maxRange : {
        type : String,
    },
    minRange : {
        type : String,
    },
    trendReadings : {
        type : Array,
    },
    meterReadings : {
        type : Array
    },
    FirstReadings : {
        type : Array,
    },
    LoteReadings : {
        type : Array,
    },
    HourReadings : {
        type : Array,
    },
    DayReadings : {
        type : Array,
    },
    MonthReadings : {
        type : Array,
    },

    image : {type:Object},
    isImgDel : {
        type : Boolean,
        default : false,
    },
    machineId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'machine'
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'department'
    },
    buildingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'building'
    },
}, {
    timestamps: true,
})

const device = mongoose.model('device', deviceModel)
module.exports =  device;