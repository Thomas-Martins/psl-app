// LoginProvider.ts
import api from "./api";

interface LoginPayload {
    email: string;
    password: string;
}

class LoginProvider {
    // La méthode login retourne la promesse de l'appel API
    static login(payload: LoginPayload) {
        return api.post("/login", payload);
    }
}

export default LoginProvider;
