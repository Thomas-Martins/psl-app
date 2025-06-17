import api from "@core/api/api.ts";

class CustomersProvider {
    static getCustomers(query = {}) {
        query = { ...query, onlyCustomers: true };
        return api.get("/users", { params: query });
    }

    static getCustomer(id: string) {
        return api.get(`/users/${id}`);
    }

    static createCustomer(payload: object) {
        return api.post("/users", payload);
    }

    static updateCustomer(id: string, payload: object) {
        return api.put(`/users/${id}`, payload);
    }

    static deleteCustomer(id: string) {
        return api.delete(`/users/${id}`);
    }
}

export default CustomersProvider;
