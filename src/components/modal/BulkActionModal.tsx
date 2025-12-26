import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import { Users, AlertTriangle, Ban, UserCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BulkOperationUsers,
  GetAllUsers,
  UserType,
} from "@/store/slices/user.slice";
import { useAppDispatch } from "@/store/hook";

const bulkActionSchema = z.object({
  operation: z.enum(["SUSPEND", "UNSUSPEND", "DELETE"], {
    required_error: "Veuillez sélectionner une opération.",
  }),
  reason: z.string().min(10, {
    message: "La raison doit contenir au moins 10 caractères.",
  }),
});

type BulkActionFormValues = z.infer<typeof bulkActionSchema>;

interface BulkActionModalProps {
  users: UserType[];
  userIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    userIds: string[];
    operation: string;
    reason: string;
  }) => void;
}

const operationConfig = {
  SUSPEND: {
    label: "Suspendre",
    icon: Ban,
    color: "text-warning",
    description: "Les utilisateurs ne pourront plus accéder à la plateforme.",
  },
  UNSUSPEND: {
    label: "Activer",
    icon: UserCheck,
    color: "text-success",
    description: "Les utilisateurs pourront à nouveau accéder à la plateforme.",
  },
  DELETE: {
    label: "Supprimer",
    icon: Trash2,
    color: "text-destructive",
    description: "Les comptes seront définitivement supprimés.",
  },
};

export function BulkActionModal({
  users,
  userIds,
  open,
  onOpenChange,
}: BulkActionModalProps) {
  const { toast } = useToast();

  const form = useForm<BulkActionFormValues>({
    resolver: zodResolver(bulkActionSchema),
    defaultValues: {
      operation: undefined,
      reason: "",
    },
  });

  const dispatch = useAppDispatch();

  const selectedOperation = form.watch("operation");

  const handleSubmit = async (data: BulkActionFormValues) => {
    try {
      await dispatch(
        BulkOperationUsers({
          userIds,
          operation: data.operation,
          reason: data.reason,
        })
      ).unwrap();
      toast({
        title: "Action effectuée",
        description: `${userIds.length} utilisateur(s) ont été traités avec succès.`,
      });
      await dispatch(GetAllUsers()).unwrap();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.toString(),
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-foreground">
                Action groupée
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {userIds.length} utilisateur(s) sélectionné(s)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            Cette action sera appliquée à tous les utilisateurs sélectionnés.
            Cette opération peut être irréversible.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-foreground">Opération</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Sélectionnez une opération" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border">
                      {Object.entries(operationConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon
                              className={cn("w-4 h-4", config.color)}
                            />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedOperation && (
                    <FormDescription className="text-xs text-muted-foreground">
                      {
                        operationConfig[
                          selectedOperation as keyof typeof operationConfig
                        ].description
                      }
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-foreground">Raison</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la raison de cette action groupée..."
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[0.65rem] text-muted-foreground">
                    Cette raison sera enregistrée dans l'historique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="px-4 py-2.5 space-y-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-foreground">
                Utilisateurs concernés:
              </p>
              <div className="flex flex-wrap gap-2">
                {userIds.slice(0, 5).map((id, index) => (
                  <span
                    key={id}
                    className="px-2.5 py-1 text-[.7rem] rounded-full bg-primary/10 text-primary"
                  >
                    {users?.find((x) => x?.id === id)?.displayName}
                  </span>
                ))}
                {userIds.length > 5 && (
                  <span className="px-2.5 py-1 text-[.7rem] rounded-full bg-muted text-muted-foreground">
                    +{userIds.length - 5} autres
                  </span>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-border text-foreground hover:bg-muted"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant={
                  selectedOperation === "DELETE" ? "destructive" : "default"
                }
                disabled={form.formState.isSubmitting || !selectedOperation}
                className={
                  selectedOperation !== "DELETE"
                    ? "gradient-primary text-primary-foreground"
                    : ""
                }
              >
                {form.formState.isSubmitting
                  ? "Traitement..."
                  : "Confirmer l'action"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
