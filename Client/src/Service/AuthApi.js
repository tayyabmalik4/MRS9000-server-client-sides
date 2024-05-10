import axios from '../AxiosInstance';


const signup = async (signupdata) =>{
    try {
        return await axios.post(`/signup`, signupdata);
    } catch (error) {
        console.log(`Your Internet is not Connected`)
    }
}

// export const login = async (logindata) =>{
//     try {
//         return await axios.post(`/login`,logindata)
//     } catch (error) {
//         console.log(`Your Internet is not Connected`)
//     }
// }

const LoginAPI = async ({ email, password }) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/auth/login",
            method: "POST",
            data: {
                email,
                password
            }
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

export {LoginAPI, signup}