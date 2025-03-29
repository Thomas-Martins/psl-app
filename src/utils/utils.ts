export const roleName = (role: string) => {
    switch (role) {
        case "admin":
            return "Administrateur";
        case "gestionnaire":
            return "Gestionnaire";
        case "logisticien":
            return "Logisticien";
    }
};

export const chipRoleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-primary-400";
        case "gestionnaire":
            return "bg-violet";
        case "logisticien":
            return "bg-light-100";
    }
};

export const InitialsLetter = (firstname: string, lastname: string) => {
    return firstname.charAt(0) + lastname.charAt(0);
};
