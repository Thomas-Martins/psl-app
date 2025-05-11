import api from "../api.ts";

class StoresProvider {
    static getStores(query = {}) {
        return api.get("/stores", { params: query });
    }

    static getStore(id: number) {
        return api.get(`/stores/${id}`);
    }

    static createStore(payload: object) {
        return api.post("/stores", payload);
    }

    static updateStore(id: string, payload: object) {
        return api.put(`/stores/${id}`, payload);
    }

    static deleteStore(id: number) {
        return api.delete(`/stores/${id}`);
    }
}

export default StoresProvider;
