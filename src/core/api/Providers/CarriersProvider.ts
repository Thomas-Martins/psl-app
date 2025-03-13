// CarriersProvider.ts

import api from "../api.ts";

class CarriersProvider {
    static getCarriers(query = {}) {
        return api.get("/carriers", { params: query });
    }

    static getCarrier(id: number) {
        return api.get(`/carriers/${id}`);
    }

    static createCarrier(payload: object, query = {}) {
        return api.post("/carriers", payload, { params: query });
    }

    static updateCarrier(id: number, payload: object, query = {}) {
        return api.put(`/carriers/${id}`, payload, { params: query });
    }

    static deleteCarrier(id: number) {
        return api.delete(`/carriers/${id}`);
    }
}

export default CarriersProvider;
