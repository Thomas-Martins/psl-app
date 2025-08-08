import { useEffect, useState } from "react";

export function useIsDark(): boolean {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== "undefined") {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        if (
            typeof document === "undefined" ||
            typeof MutationObserver === "undefined"
        )
            return;
        setIsDark(document.documentElement.classList.contains("dark"));
        const obs = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => obs.disconnect();
    }, []);

    return isDark;
}
