import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    id: '',
    isAdmin: false,
    city: '',
    refreshToken: '',

}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', phone = '', address = '', access_token = '', avatar = '', _id = '', isAdmin, city = '', refreshToken = '' } = action.payload
            state.name = name || email;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.id = _id ? _id : state.id
            state.access_token = access_token;
            state.refreshToken = refreshToken;
            state.isAdmin = isAdmin;
            state.city = city;


        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.city = '';
            state.refreshToken = '';

        },
    },
})

export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer