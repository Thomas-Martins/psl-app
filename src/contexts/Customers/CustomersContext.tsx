import { createContext, useContext } from "react";
import { PaginatedCustomers } from "@/types/Customers";

interface CustomersContextType {
    mutate: () => Promise<PaginatedCustomers | undefined>;
}

export const CustomersContext = createContext<CustomersContextType | undefined>(
    undefined,
);

export const useCustomers = () => {
    const context = useContext(CustomersContext);
    if (!context) {
        throw new Error("useCustomers must be used within a CustomersProvider");
    }
    return context;
};
