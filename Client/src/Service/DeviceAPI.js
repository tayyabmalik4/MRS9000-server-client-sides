import axios from '../AxiosInstance';
import AuthTokenGen from '../Utils/AuthTokenGen'

const CreateDeviceAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null,
    }
    try {
        let res = await axios({
            url: "/device",
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

const UpdateDeviceAPI = async (id, formData) => {
    let resolved = {
        error: null,
        data: null
    }
    try {
        let res = await axios({
            url: `/device/${id}`,
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

const GetDeviceData = async (id) => {
    let resolved = {
        data: null,
        error: null
    }
    try {
        const response = await axios({
            url: `/device/get`,
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

const DeleteDeviceAPI = async (id) =>{
    let resolved = {
        error : null,
        data : null
    }
    try {
        let res = await axios({
            url : `/device/${id}`,
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

export {CreateDeviceAPI, UpdateDeviceAPI, GetDeviceData, DeleteDeviceAPI};