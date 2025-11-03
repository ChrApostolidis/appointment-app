
type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const baseStyles =
    "cursor-pointer font-semibold py-2.5 px-6 rounded-lg shadow-md";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary hover:bg-[#00b8d6] text-foreground",
    secondary:
      "bg-transparent border border-[#00ccee] text-[#00ccee] hover:bg-[#00ccee] hover:text-white focus:ring-[#00ccee]",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
