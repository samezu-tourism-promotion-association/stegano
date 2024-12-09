import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export default function Button({
  text,
  icon,
  onClick,
  bgColor = "bg-primary",
  className,
}: {
  text: string;
  icon?: IconType;
  bgColor?: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center justify-center text-xl gap-2 px-4 py-2 text-white rounded-full",
        bgColor,
        className
      )}
    >
      {icon && icon({ size: 24 })}
      <span>{text}</span>
    </button>
  );
}
