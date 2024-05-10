const auth = require('./auth/index')
const building = require('./building/index')
const department = require('./department/index')
const machine = require('./machine/index')
const device = require('./device/index')
const meter = require('./meter/index')


const controllers = {
    auth,
    building,
    machine,
    device,
    meter,
    department,
}

module.exports = controllers;