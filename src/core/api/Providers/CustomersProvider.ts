import api from "@core/api/api.ts";

class CustomersProvider {
    static getCustomers(query = {}) {
        query = { ...query, onlyCustomers: true };
        return api.get("/users", { params: query });
    }

    static getCustomer(id: number) {
        return api.get(`/users/${id}`);
    }

    static createCustomer(payload: object) {
        return api.post("/users", payload);
    }

    static updateCustomer(id: number, payload: object) {
        return api.put(`/users/${id}`, payload);
    }

    static deleteCustomer(id: number) {
        return api.delete(`/users/${id}`);
    }
}

export default CustomersProvider;
