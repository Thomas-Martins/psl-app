import {
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import RolesProvider from "@core/api/Providers/RolesProvider.ts";
import React, { useEffect, useState } from "react";
import { roleName } from "@utils/utils.ts";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { Role } from "@/types/Role.ts";
import { useTranslation } from "react-i18next";
import { validators } from "./UserAddModal.validators.ts";

interface UserAddModalProps {
    fetchUsers: () => void;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
export default function UserAddModal({
    fetchUsers,
    isOpen,
    onOpenChange,
}: UserAddModalProps) {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<Role[]>([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        (async () => {
            await fetchRoles();
        })();
    }, []);

    const fetchRoles = async () => {
        await RolesProvider.getRoles().then((response) => {
            setRoles(response.data);
        });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as Record<string, string>;

        const errorsTemp: { [key: string]: string } = {};

        Object.keys(validators).forEach((field) => {
            const validator = validators[field];
            const error = validator(data[field] || "");
            if (error) {
                errorsTemp[field] = error;
            }
        });

        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp);
            return;
        }

        setErrors({});
        await UsersProvider.createUser(data);
        fetchUsers();
        onOpenChange(false);
    };

    return (
        <>
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Ajouter un utilisateur
                            </ModalHeader>
                            <ModalBody>
                                <Form
                                    id="user-form"
                                    onSubmit={handleSubmit}
                                    validationErrors={errors}
                                >
                                    <div className="flex w-full gap-5">
                                        <Input
                                            isRequired
                                            label={t(
                                                "users.add.inputs.firstname",
                                            )}
                                            labelPlacement="outside"
                                            name="firstname"
                                            placeholder={t(
                                                "users.add.inputs.firstname",
                                            )}
                                            type="text"
                                            errorMessage={t(
                                                "users.add.errors.firstname.required",
                                            )}
                                        />
                                        <Input
                                            isRequired
                                            label={t(
                                                "users.add.inputs.lastname",
                                            )}
                                            labelPlacement="outside"
                                            name="lastname"
                                            placeholder={t(
                                                "users.add.inputs.lastname",
                                            )}
                                            type="text"
                                            errorMessage={t(
                                                "users.add.errors.lastname.required",
                                            )}
                                        />
                                    </div>
                                    <div className="flex w-full gap-5">
                                        <Input
                                            isRequired
                                            label={t("users.add.inputs.email")}
                                            labelPlacement="outside"
                                            name="email"
                                            placeholder="example@mail.com"
                                            type="email"
                                        />
                                        <Input
                                            isRequired
                                            label={t("users.add.inputs.phone")}
                                            labelPlacement="outside"
                                            name="phone"
                                            placeholder="0601020304"
                                            type="tel"
                                        />
                                    </div>
                                    <Input
                                        isRequired
                                        label={t("users.add.inputs.address")}
                                        labelPlacement="outside"
                                        name="address"
                                        placeholder="Adresse"
                                        type="text"
                                    />
                                    <div className="flex w-full gap-5">
                                        <Input
                                            isRequired
                                            label={t(
                                                "users.add.inputs.zipcode",
                                            )}
                                            labelPlacement="outside"
                                            name="zipcode"
                                            placeholder="75000"
                                            type="text"
                                        />
                                        <Input
                                            isRequired
                                            label={t("users.add.inputs.city")}
                                            labelPlacement="outside"
                                            name="city"
                                            placeholder="Paris"
                                            type="text"
                                        />
                                    </div>
                                    <Select
                                        label={t("users.add.inputs.role.title")}
                                        aria-label={"Role"}
                                        name="role_id"
                                        size="md"
                                        labelPlacement="outside"
                                        placeholder={t(
                                            "users.add.inputs.role.placeholder",
                                        )}
                                        isRequired
                                    >
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {roleName(role.name)}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    {t("generics.cancel")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    form="user-form"
                                >
                                    {t("users.add.button")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
