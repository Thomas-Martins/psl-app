// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/types/Role.ts";
import { Store } from "@/types/Stores.ts";

interface UserState {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    zipcode: string;
    city: string;
    role: Role | null;
    store?: Store | null;
    identity?: string;
    image_url?: string;
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
    role: null,
    store: null,
    identity: "",
    image_url: "",
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
            role: null,
            store: null,
            identity: "",
            image_url: "",
        }),
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            Object.assign(state, action.payload);
        },
        updateStore: (state, action: PayloadAction<Partial<Store>>) => {
            if (!state.store) {
                state.store = {
                    id: "",
                    name: "",
                    address: "",
                    zipcode: "",
                    city: "",
                    phone: "",
                    email: "",
                    customers_count: 0,
                    image_url: "",
                    full_address: "",
                    siret: "",
                    ...action.payload,
                };
                return;
            }
            state.store = {
                ...state.store,
                ...action.payload,
            };
        },
    },
});

export const { setUser, clearUser, updateStore, updateUser } =
    userSlice.actions;
export default userSlice.reducer;
