// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    zipcode: string;
    city: string;
    role: string;
}

const initialState: UserState = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
    city: "",
    role: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (_, action: PayloadAction<UserState>) => action.payload,
        clearUser: () => ({
            id: "",
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            address: "",
            zipcode: "",
            city: "",
            role: "",
        }),
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
