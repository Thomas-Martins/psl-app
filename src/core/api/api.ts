// api.ts
import axios, { AxiosInstance } from "axios";

class Api {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                Accept: "application/json",
            },
        });
    }

    get(url: string, config?: object) {
        return this.axiosInstance.get(url, config);
    }

    post(url: string, payload: object, config?: object) {
        return this.axiosInstance.post(url, payload, config);
    }

    put(url: string, payload: object, config?: object) {
        return this.axiosInstance.put(url, payload, config);
    }

    delete(url: string, config?: object) {
        return this.axiosInstance.delete(url, config);
    }
}

const api = new Api(import.meta.env.VITE_API_URL);

export default api;
