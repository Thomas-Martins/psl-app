// SuppliersProvider.ts
import api from "../api.ts";

class SuppliersProvider {
    static getSuppliers(query = {}) {
        return api.get("/suppliers", { params: query });
    }

    static getSupplier(id: number) {
        return api.get(`/suppliers/${id}`);
    }

    static createSupplier(payload: object) {
        return api.post("/suppliers", payload);
    }

    static updateSupplier(id: number, payload: object) {
        return api.put(`/suppliers/${id}`, payload);
    }

    static deleteSupplier(id: number) {
        return api.delete(`/suppliers/${id}`);
    }
}

export default SuppliersProvider;
