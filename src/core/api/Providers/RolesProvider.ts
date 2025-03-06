//RolesProvider.ts

import api from "../api.ts";

class RolesProvider {
    static getRoles() {
        return api.get("/roles");
    }
}

export default RolesProvider;
