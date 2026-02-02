import { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName =
  "w-full h-11 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-white font-medium shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

export default function PrimaryButton({
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={[baseClassName, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
