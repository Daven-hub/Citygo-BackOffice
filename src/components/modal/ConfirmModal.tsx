import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconClassName: "text-destructive",
    bgClassName: "bg-destructive/10",
    actionClassName: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "text-warning",
    bgClassName: "bg-warning/10",
    actionClassName: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  success: {
    icon: CheckCircle,
    iconClassName: "text-success",
    bgClassName: "bg-success/10",
    actionClassName: "bg-success text-success-foreground hover:bg-success/90",
  },
  info: {
    icon: Info,
    iconClassName: "text-primary",
    bgClassName: "bg-primary/10",
    actionClassName: "gradient-primary text-primary-foreground",
  },
};

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "info",
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center", config.bgClassName)}>
              <Icon className={cn("w-6 h-6", config.iconClassName)} />
            </div>
            <div>
              <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-0.5 text-xs">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel className="border-border">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={config.actionClassName}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
