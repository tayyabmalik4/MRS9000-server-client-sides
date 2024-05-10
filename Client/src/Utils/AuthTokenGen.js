const useToken = () => {
    let token = localStorage.getItem("UserToken")
    let AuthToken = token ?? null
    return {
        Authorization: `Bearer ${AuthToken}`
    }
}

export default useToken;