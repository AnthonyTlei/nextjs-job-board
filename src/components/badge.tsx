import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "bg-muted text-muted-foreground rounded border px-2 py-0.5 text-sm font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
