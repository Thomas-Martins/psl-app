import api from "../api";

class CartsProvider {
    static createCart(payload: object, query = {}) {
        return api.post("/carts", payload, { params: query });
    }

    static getCartByUserId(userId: string) {
        return api.get(`/carts/user/${userId}`);
    }

    static deleteCart(userId: string) {
        return api.delete(`/carts/user/${userId}`);
    }
}

export default CartsProvider;
