import { IconsProps } from "@/types/icons.ts";

export default function CheckIcon({ size = 24, color = "black" }: IconsProps) {
    return (
        <svg
            width={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 12.9L10.1429 16.5L18 7.5"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
