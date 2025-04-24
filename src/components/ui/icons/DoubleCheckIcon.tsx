import { IconsProps } from "@/types/icons.ts";

export default function DoubleCheckIcon({
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
                d="M4 12.9L7.14286 16.5L15 7.5"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20.0002 7.5625L11.4285 16.5625L11.0002 16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
