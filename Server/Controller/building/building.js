
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require('../../constants/index.js');
const roles = require('../../constants/roles.js');
const building = require('../../model/buildingModel.js');
const department = require('../../model/departmentModel.js')
const machine = require('../../model/machineModel.js')
const device = require('../../model/deviceModel.js')
const catchAsync = require('../../utils/catchAsync.js');
const { uploadFile } = require('../../utils/uploader.js');


const addBuilding = catchAsync(async (req, res) => {
    const data = req.body;

    try {
        if (!data?.title || data?.title == "" || !data?.detail || data?.detail == "") {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.REQUIRED.FIELD })
        }
        if (req.file) {
            data.image = await uploadFile(req.file, data?.image?.url || null)
        }

        const newData = new building(data)
        await newData.save()
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED, result: newData })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


const getAllBuilding = catchAsync(async (req, res) => {

    try {
        const result = await building.find({});
        res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS, result })
    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

// Update building
const updateBuildingById = catchAsync(async (req, res) => {
    let data = req.body
    let buildingId = req.params.id

    try {
        const FindOne = await building.findById(buildingId)
        if (!FindOne) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }

        if (data.isImgDel == "true") {
            data.image = {};
        } else {
            if (req.file) {
                data.image = await uploadFile(req.file, data?.image?.url || null);
            }
        }
        const result = await building.findByIdAndUpdate(buildingId, data, { new: true })
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE, result })
    }
    catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})


// Delete Building
const deleteBuildingById = catchAsync(async (req, res) => {
    const currentUser = req.user
    const buildingId = req.params.id
    try {
        const FindDep = await department.find({ buildingId: buildingId })
        if (FindDep?.length >= 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "First Department Delete in this Building" })
        }
        const FindMachine = await machine.find({ buildingId: buildingId })
        if (FindMachine?.length >= 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "First Delete Machine in this Department" })
        }
        const FindDevice = await device.find({ buildingId: buildingId })
        if (FindDevice?.length >= 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "First Delete Devices in this Building" })
        }
        const FindOne = await building.findById(buildingId);
        if (!FindOne) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.INVALID.NOT_FOUND })
        }
        let result;
        if ([roles.ADMIN, roles.SUPERADMIN].includes(currentUser.role)) {
            result = await building.findByIdAndDelete(buildingId);
        } else {
            return res.statua(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.UNAUTHORIZED.UNAUTHORIZE })
        }
        return res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE })
    } catch (err) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

module.exports = { addBuilding, getAllBuilding, updateBuildingById, deleteBuildingById }