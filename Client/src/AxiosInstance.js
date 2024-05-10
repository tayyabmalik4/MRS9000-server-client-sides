import axios from "axios";

let SERVER = window.location.origin
const Instance = axios.create({
    // baseURL: "http://localhost:4000/api"
    baseURL: `${SERVER}/api`
})

// window.location.CustomURL = `${baseURL}/static`

// // Logout if no Token or Unauthenticated :
// Instance.interceptors.response.use(undefined, function x(err) {
//     // if (err?.response?.status == 401) {
//     if (err?.response?.status == 401 && !window.location.pathname == "/login") {
//         localStorage.clear()
//         setTimeout(() => {
//             window.location.href = "/"
//         }, 1500)
//         return Promise.reject(err)

//     }
//     return Promise.reject(err)
// })

export default Instance