import axios from '../AxiosInstance'
import AuthTokenGen from '../Utils/AuthTokenGen'


export const GetMeterData = async (data) =>{
    let resolved = {
        data : null,
        error : null
    }
    try {
        const response = await axios({
            url : '/meter',
            method : "POST",
            data : data,
            headers : AuthTokenGen()
        })
        resolved.data = response.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Your Internet is Not Connected"
        }
    }
    return resolved
}