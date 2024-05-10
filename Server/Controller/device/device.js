
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require('../../constants/index.js');
const roles = require('../../constants/roles.js');
const device = require('../../model/deviceModel.js');
const catchAsync = require('../../utils/catchAsync.js');
const {uploadFile} = require('../../utils/uploader.js');


const addDevice = catchAsync(async (req, res) => {
    const data = req.body;
    machineId = data?.machineId
    try {
        if(!data?.title || data?.title=="" || !data?.Device_ID || data?.Device_ID == "" || !data?.MQTT_ID || data?.MQTT_ID == "" || !data?.machineId || data?.machineId == ""){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.REQUIRED.FIELD })
        }
        let mqttId =await device.find({MQTT_ID : data?.MQTT_ID})
        if(mqttId?.length>0){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "MQTT ID Already Registered" })
        }
        let deviceId =await device.find({Device_ID : data?.Device_ID})
        if(deviceId?.length>0){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Device ID Already Registered" })
        }
        if(req.file){
            data.image = await uploadFile(req.file, data?.image?.url || null)
        }
        
        const newData = new device(data)
        await newData.save()
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED, result: newData })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


const getAllDevice = catchAsync(async (req, res) => {
    const data = req.body;
    machineId = data?.machineId
    try {
        let result = {};
        if(machineId){
            result = await device.find({machineId:machineId});
        }
        res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS, result })
    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

// Update Device
const updateDeviceById = catchAsync(async(req,res)=>{
    let data = req.body
    let deviceId = req.params.id

    try{
        const FindOne = await device.findById(deviceId)
        if(data?.title != FindOne?.title){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "You Can't Change Device Name" })
        }
        if(!FindOne){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        let mqttId =await device.find({MQTT_ID : data?.MQTT_ID})
        // console.log(mqttId)
        if(mqttId?.length>0){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "MQTT ID Already Registered" })
        }
        // let deviceId =await device.find({Device_ID : data?.Device_ID})
        // if(deviceId?.length>=1){
        //     return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Device ID Already Registered" })
        // }
        
        // if(data.isImgDel == "true"){
        //     data.image = {};
        // }else{
        //     if(req.file){
        //         data.image = await uploadFile(req.file, data?.image?.url || null);
        //     }
        // }
        const result = await device.findByIdAndUpdate(deviceId, data, {new:true})
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE, result })
    }
    catch(err){
        // console.log("this is error",err)
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

// Delete Device
const deleteDeviceById = catchAsync(async (req, res) => {
    const currentUser = req.user
    const deviceId = req.params.id
    try {
        const FindOne = await device.findById(deviceId);
        if (!FindOne) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        let result;
        if ([roles.ADMIN, roles.SUPERADMIN].includes(currentUser.role)) {
            result = await device.findByIdAndDelete(deviceId);
        } else {
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:ERRORS.UNAUTHORIZED.UNAUTHORIZE})
        }
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

module.exports = {addDevice,  getAllDevice, updateDeviceById, deleteDeviceById}