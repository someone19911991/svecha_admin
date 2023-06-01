import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAuth, IUser} from "../../interfaces";

const initialState: IAuth = {user: {} as IUser, accessToken: ''}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentialsAction: (state, action: PayloadAction<IAuth>) => {
            const {user, accessToken} = action.payload
            state.accessToken = accessToken
            state.user = user
        },
        logoutAction: (state) => {
            state.accessToken = ''
            state.user = {} as IUser
        }
    }
})

export default authSlice.reducer

export const {setCredentialsAction, logoutAction} = authSlice.actions