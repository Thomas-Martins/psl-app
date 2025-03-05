import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react";
import {
    confirmationModalService,
    ModalProps,
} from "@utils/GlobalModal/ConfirmationModalService";
import { ConfirmationModalContext } from "@utils/GlobalModal/ConfirmationModalContext";
import { Trans, useTranslation } from "react-i18next";

/**
 * Provides a global confirmation modal.
 * Manages modal state and registers the openModal function.
 */
export const ConfirmationModalProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { t } = useTranslation();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);

    // Opens the modal with given props
    const openModal = useCallback(
        (props: ModalProps) => {
            setModalProps(props);
            onOpen();
        },
        [onOpen],
    );

    // Closes the modal and resets props
    const closeModal = () => {
        onOpenChange();
        setModalProps(null);
    };

    // Register the openModal function for global access
    useEffect(() => {
        confirmationModalService.register(openModal);
    }, [openModal]);

    return (
        <ConfirmationModalContext.Provider value={{ openModal }}>
            {children}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {modalProps?.title || t("global.confirmation")}
                            </ModalHeader>
                            <ModalBody>
                                <Trans t={t} parent="span">
                                    {modalProps?.message}
                                </Trans>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={() => {
                                        closeModal();
                                    }}
                                >
                                    {modalProps?.cancelButton ||
                                        t("generics.cancel")}
                                </Button>
                                <Button
                                    color={modalProps?.color || "primary"}
                                    onPress={() => {
                                        if (modalProps?.onConfirm()) {
                                            modalProps?.onConfirm();
                                        }
                                        closeModal();
                                    }}
                                >
                                    {modalProps?.actionButton ||
                                        t("generics.save")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </ConfirmationModalContext.Provider>
    );
};
