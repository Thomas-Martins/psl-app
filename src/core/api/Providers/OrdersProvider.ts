import api from "../api.ts";

class OrdersProvider {
    static getOrders(query = {}) {
        return api.get("/orders", { params: query });
    }

    static getOrder(id: string) {
        return api.get(`/orders/${id}`);
    }

    static createOrder(payload: object, query = {}) {
        return api.post("/orders", payload, { params: query });
    }

    static updateOrder(id: string, payload: object, query = {}) {
        return api.put(`/orders/${id}`, payload, { params: query });
    }

    static deleteOrder(id: string) {
        return api.delete(`/orders/${id}`);
    }
}

export default OrdersProvider;
