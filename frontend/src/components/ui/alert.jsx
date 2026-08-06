import { cn } from "@/lib/utils";

function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        variant === "destructive"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-border bg-muted/40 text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return <div className={cn("font-medium leading-none tracking-tight", className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
  return <div className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
