import { IconsProps } from "@/types/icons.ts";

export default function ArrowLeftIcon({
    size = 24,
    color = "black",
}: IconsProps) {
    return (
        <svg
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 12H4M4 12L10 6M4 12L10 18"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
