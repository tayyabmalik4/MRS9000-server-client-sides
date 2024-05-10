
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require('../../constants/index.js');
const roles = require('../../constants/roles.js');
const department = require('../../model/departmentModel.js');
const machine = require('../../model/machineModel.js')
const device = require('../../model/deviceModel.js')
const catchAsync = require('../../utils/catchAsync.js');
const {uploadFile} = require('../../utils/uploader.js');


const addDepartment = catchAsync(async (req, res) => {
    const data = req.body;
    buildingId = data?.buildingId
    
    try {
        if(!data?.title || data?.title=="" || !data?.detail || data?.detail == ""){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.REQUIRED.FIELD })
        }
        if(req.file){
            data.image = await uploadFile(req.file, data?.image?.url || null)
        }
        
        const newData = new department(data)
        await newData.save()
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED, result: newData })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


const getAllDepartment = catchAsync(async (req, res) => {
    const data = req.body;
    buildingId = data?.buildingId
    try {
        let result = {};
        if(buildingId){
            result = await department.find({buildingId:buildingId});
        }
        res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS, result })
    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

// Update Department
const updateDepartmentById = catchAsync(async(req,res)=>{
    let data = req.body
    let departmentId = req.params.id

    try{
        const FindOne = await department.findById(departmentId)
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
        const result = await department.findByIdAndUpdate(departmentId, data, {new:true})
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE, result })
    }
    catch(err){
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


// Delete Department
const deleteDepartmentById = catchAsync(async (req, res) => {
    const currentUser = req.user
    const departmentId = req.params.id
    try {
        const FindMachine = await machine.find({departmentId : departmentId})
        if(FindMachine?.length>=1){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message : "First Delete Machine in this Department"})
        }
        const FindDevice = await device.find({departmentId : departmentId})
        if(FindDevice?.length>=1){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message : "First Delete Machine in this Department"})
        }
        const FindOne = await department.findById(departmentId);
        if (!FindOne) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        let result;
        if ([roles.ADMIN, roles.SUPERADMIN].includes(currentUser.role)) {
            result = await department.findByIdAndDelete(departmentId);
        } else {
            return res.statua(STATUS_CODE.BAD_REQUEST).json({message:ERRORS.UNAUTHORIZED.UNAUTHORIZE})
        }
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

module.exports = {addDepartment,  getAllDepartment, updateDepartmentById, deleteDepartmentById}