import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const Select = forwardRef<
  HTMLSelectElement,
  React.HTMLProps<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        {...props}
        ref={ref}
        className={cn(
          "bg-background border-input ring-offset-background focus:ring-ring h-10 w-full cursor-pointer appearance-none truncate rounded-md border py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 opacity-50" />
    </div>
  );
});

Select.displayName = "Select";

export default Select;
