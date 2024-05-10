import axios from '../AxiosInstance';
import AuthTokenGen from '../Utils/AuthTokenGen'




const CreateBuildingAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null,
    }
    try {
        let res = await axios({
            url: "/building",
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

const UpdateBuildingAPI = async (id, formData) => {
    let resolved = {
        error: null,
        data: null
    }
    try {
        let res = await axios({
            url: `/building/${id}`,
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

const GetBuildingData = async () => {
    let resolved = {
        data: null,
        error: null
    }
    try {
        const response = await axios({
            url: `/building/get`,
            method: "GET",
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

const DeleteBuildingAPI = async (id) =>{
    let resolved = {
        error : null,
        data : null
    }
    try {
        let res = await axios({
            url : `/building/${id}`,
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

export {CreateBuildingAPI, UpdateBuildingAPI, GetBuildingData, DeleteBuildingAPI};