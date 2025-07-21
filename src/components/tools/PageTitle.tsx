import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PageTitleProps {
    i18nKey: string;
    suffix?: string;
    options?: Record<string, unknown>;
}

export default function PageTitle({
    i18nKey,
    suffix,
    options,
}: PageTitleProps) {
    const { t } = useTranslation();
    useEffect(() => {
        let title = t(i18nKey, options);
        if (suffix) title += ` ${suffix}`;
        document.title = `PSL | ${title}`;
    }, [t, i18nKey, suffix, options]);
    return null;
}
