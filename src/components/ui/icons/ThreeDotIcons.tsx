import { IconsProps } from "@/types/icons.ts";

export default function ThreeDotIcons({ size, color }: IconsProps) {
    return (
        <svg
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="rotate(90, 12, 12)">
                <circle cx="5" cy="12" r="2" stroke={color} strokeWidth="1.5" />
                <circle
                    cx="12"
                    cy="12"
                    r="2"
                    stroke={color}
                    strokeWidth="1.5"
                />
                <circle
                    cx="19"
                    cy="12"
                    r="2"
                    stroke={color}
                    strokeWidth="1.5"
                />
            </g>
        </svg>
    );
}
