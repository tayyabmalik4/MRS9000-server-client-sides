const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require('../../constants/index.js');
const roles = require('../../constants/roles.js');
const device = require('../../model/deviceModel')
const catchAsync = require('../../utils/catchAsync.js');

const getMeter = catchAsync(async (req, res) => {
    const data = req.body;
    let MQTT_ID = data?.MQTT_ID
    try {
        let result = {};
        if (MQTT_ID) {
            result = await device.findOne({ MQTT_ID: MQTT_ID });
        }
        res.status(STATUS_CODE.OK).json({ message: SUCCESS_MSG.SUCCESS_MESSAGES.SUCCESS, result })
    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ message: ERRORS.PROGRAMMING.SOME_ERROR, err })
    }
})

module.exports = { getMeter }
