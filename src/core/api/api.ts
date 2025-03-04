// api.ts
import axios, { AxiosInstance } from "axios";
import { userSlice } from "@store/userSlice.ts";
import { store } from "@store/store.ts";

class Api {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                Accept: "application/json",
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("psl_access_token");
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("psl_access_token");
                    store.dispatch(userSlice.actions.clearUser());
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            },
        );
    }

    get(url: string, config?: object) {
        return this.axiosInstance.get(url, config);
    }

    post(url: string, payload?: object, config?: object) {
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
