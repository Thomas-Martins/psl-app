//UsersProvider.ts
import api from "../api.ts";

class UsersProvider {
    static getUsers(query = {}) {
        return api.get("/users", { params: query });
    }

    static getUser(id: number, query = {}) {
        return api.get(`/users/${id}`, { params: query });
    }

    static createUser(payload: object) {
        return api.post("/users", payload);
    }

    static updateUser(id: string, payload: object) {
        return api.put(`/users/${id}`, payload);
    }

    static deleteUser(id: number) {
        return api.delete(`/users/${id}`);
    }

    static logout() {
        return api.post("/logout");
    }

    static uploadUserImage(
        id: string,
        formData: FormData,
        query: Record<string, never> = {},
    ) {
        return api.post(`/users/${id}/upload-image`, formData, {
            params: query,
        });
    }
}

export default UsersProvider;
