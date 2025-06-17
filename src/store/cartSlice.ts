import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "@/types/Cart.ts";

const initialState: CartState = {
    items: [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            state.totalPrice = action.payload.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );
        },
        addItem: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);

            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.items.push(item);
            }

            state.totalPrice += item.price * item.quantity;
        },
        removeItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            const itemToRemove = state.items.find((item) => item.id === itemId);

            if (itemToRemove) {
                state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
                state.items = state.items.filter((item) => item.id !== itemId);
            }
        },
        updateItemQuantity: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>,
        ) => {
            const { id, quantity } = action.payload;
            const itemToUpdate = state.items.find((item) => item.id === id);

            if (itemToUpdate) {
                const previousQuantity = itemToUpdate.quantity;
                if (quantity > 0) {
                    itemToUpdate.quantity = quantity;
                    state.totalPrice +=
                        (quantity - previousQuantity) * itemToUpdate.price;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        },
        removeFromCart: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>,
        ) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            if (existingItem) {
                if (existingItem.quantity <= quantity) {
                    state.items = state.items.filter((item) => item.id !== id);
                } else {
                    existingItem.quantity -= quantity;
                }
            }
        },
    },
});

export const { setCart, addItem, removeItem, updateItemQuantity, clearCart, removeFromCart } =
    cartSlice.actions;

export default cartSlice.reducer;
