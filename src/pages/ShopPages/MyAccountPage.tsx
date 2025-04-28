import MyAccountInformation from "@components/MyAccount/MyAccountInformation.tsx";
import { Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function MyAccountPage() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl font-semibold">
                {t("users.my_account.title")}
            </h1>
            <Divider />
            <MyAccountInformation />
        </div>
    );
}
