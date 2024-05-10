import axios from '../AxiosInstance';
import AuthTokenGen from '../Utils/AuthTokenGen'

const CreateMachineAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null,
    }
    try {
        let res = await axios({
            url: "/machine",
            method: "POST",
            data: formData,
            headers: AuthTokenGen()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Your Internet is Not Connected"
        }
    }
    return resolved
}

const UpdateMachineAPI = async (id, formData) => {
    let resolved = {
        error: null,
        data: null
    }
    try {
        let res = await axios({
            url: `/machine/${id}`,
            method: "PATCH",
            data: formData,
            headers: AuthTokenGen()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Your Internet is Not Connected"
        }

    }
    return resolved
}

const GetMachineData = async (id) => {
    let resolved = {
        data: null,
        error: null
    }
    try {
        const response = await axios({
            url: `/machine/get`,
            method: "POST",
            data : id,
            headers: AuthTokenGen()
        })
        resolved.data = response.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Your Internet is not Connected"
        }
    }
    return resolved
}

const DeleteMachineAPI = async (id) =>{
    let resolved = {
        error : null,
        data : null
    }
    try {
        let res = await axios({
            url : `/machine/${id}`,
            method : "DELETE",
            headers : AuthTokenGen()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved
}

export {CreateMachineAPI, UpdateMachineAPI, GetMachineData, DeleteMachineAPI};