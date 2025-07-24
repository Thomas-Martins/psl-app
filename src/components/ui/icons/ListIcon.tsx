import { IconsProps } from "@/types/icons";

export default function ListIcon({ color = "black", size }: IconsProps) {
    return (
        <svg
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 7L4 7"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M15 12L4 12"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M9 17H4"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
