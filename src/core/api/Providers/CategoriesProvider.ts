//CategoriesProvider.ts

import api from "../api.ts";

class CategoriesProvider {
    static getCategories(query = {}) {
        return api.get("/categories", { params: query });
    }
}

export default CategoriesProvider;
