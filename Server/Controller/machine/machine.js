
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require('../../constants/index.js');
const roles = require('../../constants/roles.js');
const machine = require('../../model/machineModel.js');
const device = require('../../model/deviceModel.js')
const catchAsync = require('../../utils/catchAsync.js');
const {uploadFile} = require('../../utils/uploader.js');


const addMachine = catchAsync(async (req, res) => {
    const data = req.body;
    departmentId = data?.departmentId
    try {
        if(!data?.title || data?.title=="" || !data?.detail || data?.detail == ""){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.REQUIRED.FIELD })
        }
        if(req.file){
            data.image = await uploadFile(req.file, data?.image?.url || null)
        }
        
        const newData = new machine(data)
        await newData.save()
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED, result: newData })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


const getAllMachine = catchAsync(async (req, res) => {
    const data = req.body;
    departmentId = data?.departmentId
    try {
        let result = {};
        if(departmentId){
            result = await machine.find({departmentId:departmentId});
        }
        res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS, result })
    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

// Update Machine
const updateMachineById = catchAsync(async(req,res)=>{
    let data = req.body
    let machineId = req.params.id

    try{
        const FindOne = await machine.findById(machineId)
        if(!FindOne){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        
        if(data.isImgDel == "true"){
            data.image = {};
        }else{
            if(req.file){
                data.image = await uploadFile(req.file, data?.image?.url || null);
            }
        }
        const result = await machine.findByIdAndUpdate(machineId, data, {new:true})
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE, result })
    }
    catch(err){
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


// Delete Machine
const deleteMachineById = catchAsync(async (req, res) => {
    const currentUser = req.user
    const machineId = req.params.id
    try {
        const FindDevice = await device.find({machineId : machineId})
        if(FindDevice?.length >=1){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message : "First Delete Devices in this Machine"})
        }
        const FindOne = await machine.findById(machineId);
        if (!FindOne) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        let result;
        if ([roles.ADMIN, roles.SUPERADMIN].includes(currentUser.role)) {
            result = await machine.findByIdAndDelete(machineId);
        } else {
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:ERRORS.UNAUTHORIZED.UNAUTHORIZE})
        }
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

module.exports = {addMachine,  getAllMachine, updateMachineById, deleteMachineById}