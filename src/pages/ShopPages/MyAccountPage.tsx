import MyAccountInformation from "@components/MyAccount/MyAccountInformation.tsx";
import { Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ArrowLeftIcon from "@components/ui/icons/ArrowLeftIcon.tsx";
import ChangePassword from "@components/MyAccount/ChangePassword.tsx";

export default function MyAccountPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <Button
                    variant="light"
                    isIconOnly={true}
                    onPress={() => navigate(-1)}
                >
                    <ArrowLeftIcon size={20} />
                </Button>
                <h1 className="text-xl font-semibold">
                    {t("users.my_account.title")}
                </h1>
            </div>
            <Divider />
            <MyAccountInformation />
            <Divider />
            <ChangePassword />
        </div>
    );
}
