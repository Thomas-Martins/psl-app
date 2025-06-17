import api from "../api.ts";

class OrdersProvider {
    static getOrders(query = {}) {
        return api.get("/orders", { params: query });
    }

    static getOrder(id: number) {
        return api.get(`/orders/${id}`);
    }

    static createOrder(payload: object, query = {}) {
        return api.post("/orders", payload, { params: query });
    }

    static updateOrder(id: number, payload: object, query = {}) {
        return api.put(`/orders/${id}`, payload, { params: query });
    }

    static deleteOrder(id: number) {
        return api.delete(`/orders/${id}`);
    }

    static downloadInvoice(id: number, query = {}, payload: object = {}) {
        return api.get(`/orders/${id}/invoice`, {
            params: query,
            responseType: "blob",
            ...payload,
        });
    }
}

export default OrdersProvider;
