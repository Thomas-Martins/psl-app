import api from "../api";

class CartsProvider {
    static createCart(payload: object, query = {}) {
        return api.post("/carts", payload, { params: query });
    }

    static getCartByUserId(userId: number) {
        return api.get(`/carts/user/${userId}`);
    }
}

export default CartsProvider;
