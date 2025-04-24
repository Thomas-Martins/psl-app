import { Link, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import StatusStep from "@components/Shop/cart/StatusStep.tsx";
import { Trans, useTranslation } from "react-i18next";

export default function CartConfirmation() {
    const { t } = useTranslation();
    const location = useLocation();
    const state = location.state;
    const user = useSelector((s: RootState) => s.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.order) {
            navigate("/shop", { replace: true });
        }
    }, [state, navigate]);

    if (!state?.order) {
        return null;
    }

    const { order } = state;

    return (
        <div className="bg-white p-10 rounded-2xl space-y-20 text-center shadow">
            <div className="space-y-5">
                <h1 className="text-3xl font-medium">
                    {t("orders.confirmation.title", {
                        reference: order.reference,
                    })}
                </h1>
                <div>
                    <Trans t={t} parent="span">
                        {t("orders.confirmation.emailing", {
                            email: user.email,
                        })}
                    </Trans>
                </div>
            </div>
            <StatusStep status={order.status} />
            <div>
                <p>{t("orders.confirmation.info")}</p>
                <p>
                    {t("orders.confirmation.detail")}{" "}
                    <Link
                        className="underline"
                        to={`/orders/${state.orderId ?? order.id}`}
                    >
                        {t("orders.confirmation.link")}
                    </Link>
                </p>
            </div>
            <div>
                <p className="flex justify-center gap-1 text-light-400">
                    {t("orders.confirmation.contact.title")}
                    <a
                        className="underline hover:text-black"
                        href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
                    >
                        {t("orders.confirmation.contact.link")}
                    </a>
                </p>
            </div>
        </div>
    );
}
