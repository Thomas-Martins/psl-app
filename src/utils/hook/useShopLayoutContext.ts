import { useOutletContext } from "react-router";
import { ShopLayoutContext } from "@layouts/ShopLayout/ShopLayout.tsx";

export function useShopLayout() {
    return useOutletContext<ShopLayoutContext>();
}
