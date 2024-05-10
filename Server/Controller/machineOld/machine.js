
const machine = require('../../model/machineModel.js')


const addMachine = async ( req, res) =>{

    const machinebody = req.body;
    // console.log("Machine Data is :" , machinebody)
    const newmachine = new machine(machinebody)
    try {
        await newmachine.save()
        // console.log("Machine Data is Posted SuccessFully")
        res.status(200).json(newmachine)
    } catch (error) {
        res.status(409).json({message : error.message})
    }
}


const getAllMachine = async ( req,res )=>{
    const bodyMachine = req.body
    const BuildingId = bodyMachine?.Building
    try {
        const machinedata = await machine.find({buildingId : BuildingId});
        // req.io.emit("machineData", machinedata);
        // console.log("Machine Data is Fatched SuccessFully",)
        res.status(201).json(machinedata)
    } catch (error) {
        res.status(409).json({message : error.message})
    }
}

module.exports = {addMachine, getAllMachine}