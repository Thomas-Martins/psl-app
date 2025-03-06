// ConfirmationModalService.ts

/**
 * Properties for the confirmation modal.
 */
export type ModalProps = {
    title: string;
    message: string;
    color: "primary" | "danger" | "success" | "warning";
    actionButton?: string;
    cancelButton?: string;
    onConfirm: () => void;
};

/**
 * Service to manage the opening of confirmation modals.
 */
class ConfirmationModalService {
    openModal: (props: ModalProps) => void = () => {};

    /**
     * Registers a function to open the confirmation modal.
     * @param { (props: ModalProps) => void } openModal - Function that opens the modal with the given properties.
     */
    register(openModal: (props: ModalProps) => void) {
        this.openModal = openModal;
    }
}

export const confirmationModalService = new ConfirmationModalService();
