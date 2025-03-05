// LoginProvider.ts
import api from "../api.ts";

interface LoginPayload {
    email: string;
    password: string;
}

class LoginProvider {
    // Login route
    static login(payload: LoginPayload) {
        return api.post("/login", payload);
    }
}

export default LoginProvider;
