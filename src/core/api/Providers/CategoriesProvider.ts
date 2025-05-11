//CategoriesProvider.ts

import api from "../api.ts";

class CategoriesProvider {
    static getCategories(query = {}) {
        return api.get("/categories", { params: query });
    }

    static createCategory(data: FormData) {
        return api.post("/categories", data);
    }
}

export default CategoriesProvider;
