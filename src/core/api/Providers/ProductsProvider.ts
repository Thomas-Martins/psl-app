//ProductsProvider.ts

import api from "../api.ts";

class ProductsProvider {
    static getProducts(params: GetProductsParams) {
        const flatParams = {
            ...params,
            ...(params.categories && {
                categories: Array.isArray(params.categories)
                    ? params.categories.join(",")
                    : params.categories,
            }),
        };

        return api.get("/products", { params: flatParams });
    }

    static getProduct(id: number) {
        return api.get(`/products/${id}`);
    }

    static createProduct(payload: object, query = {}) {
        return api.post("/products", payload, { params: query });
    }

    static updateProduct(id: number, payload: object, query = {}) {
        return api.put(`/products/${id}`, payload, { params: query });
    }

    static deleteProduct(id: number) {
        return api.delete(`/products/${id}`);
    }
}

export default ProductsProvider;

interface GetProductsParams {
    paginate: boolean;
    page: number;
    limit: number;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    search?: string;
    categories?: string[];
    priceRange?: [number, number];
}
