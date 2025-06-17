// SuppliersProvider.ts
import api from "../api.ts";

class SuppliersProvider {
    static getSuppliers(query = {}) {
        return api.get("/suppliers", { params: query });
    }

    static getSupplier(id: string) {
        return api.get(`/suppliers/${id}`);
    }

    static createSupplier(payload: object) {
        return api.post("/suppliers", payload);
    }

    static updateSupplier(id: string, payload: object) {
        return api.put(`/suppliers/${id}`, payload);
    }

    static deleteSupplier(id: string) {
        return api.delete(`/suppliers/${id}`);
    }
}

export default SuppliersProvider;
