import { createSlice } from "@reduxjs/toolkit";

let localUserData = localStorage.getItem("UserData")
const initialState = localUserData ? JSON.parse(localUserData) : null


export const userData = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            // state = action.payload;
            return action.payload
        }
    }

})

export default userData.reducer;
export const userDataActions = userData.actions;