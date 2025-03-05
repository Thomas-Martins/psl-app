import { createContext } from "react";
import { ModalProps } from "@utils/GlobalModal/ConfirmationModalService";

export const ConfirmationModalContext = createContext<{
    openModal: (props: ModalProps) => void;
} | null>(null);
