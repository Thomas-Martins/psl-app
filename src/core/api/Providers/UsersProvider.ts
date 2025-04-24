//UsersProvider.ts
import api from "../api.ts";

class UsersProvider {
    static getUsers(query = {}) {
        return api.get("/users", { params: query });
    }

    static getUser(id: string) {
        return api.get(`/users/${id}`);
    }

    static createUser(payload: object) {
        return api.post("/users", payload);
    }

    static updateUser(id: string, payload: object) {
        return api.put(`/users/${id}`, payload);
    }

    static deleteUser(id: string) {
        return api.delete(`/users/${id}`);
    }

    static logout() {
        return api.post("/logout");
    }
}

export default UsersProvider;
