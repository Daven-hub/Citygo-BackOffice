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
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hook/use-toast";
import { Ban, AlertTriangle } from "lucide-react";
import {
  GetUserById,
  SuspendUserById,
  UserType,
} from "@/store/slices/user.slice";
import { useAppDispatch } from "@/store/hook";

const suspendFormSchema = z.object({
  reason: z.string().min(10, {
    message: "La raison doit contenir au moins 10 caractères.",
  }),
  durationDays: z.coerce
    .number()
    .min(1, {
      message: "La durée doit être d'au moins 1 jour.",
    })
    .max(365, {
      message: "La durée ne peut pas dépasser 365 jours.",
    }),
});

type SuspendFormValues = z.infer<typeof suspendFormSchema>;

interface UserSuspendModalProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSuspendModal({
  user,
  open,
  onOpenChange,
}: UserSuspendModalProps) {
  const { toast } = useToast();

  const form = useForm<SuspendFormValues>({
    resolver: zodResolver(suspendFormSchema),
    defaultValues: {
      reason: "",
      durationDays: 7,
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (datas: SuspendFormValues) => {
    if (!user) return;
    const userId = user.id;
    try {
      await dispatch(SuspendUserById({ userId, datas })).unwrap();
      toast({
        title: "Utilisateur suspendu",
        description: `${user.displayName} a été suspendu pour ${datas.durationDays} jour(s).`,
      });
      form.reset();
      await dispatch(GetUserById(userId)).unwrap();
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <Ban className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-foreground">
                Suspendre l'utilisateur
              </DialogTitle>
              <DialogDescription className="text-sm truncate text-muted-foreground">
                {user?.displayName} - {user?.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-xs text-warning">
            Cette action empêchera l'utilisateur d'accéder à la plateforme
            pendant la durée spécifiée.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-foreground">
                    Raison de la suspension
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la raison de la suspension..."
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[0.65rem] font-light text-muted-foreground">
                    Cette raison sera visible par l'utilisateur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-sm text-foreground">
                    Durée (en jours)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      placeholder="7"
                      className="bg-background border-border text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[0.65rem] font-light text-muted-foreground">
                    Nombre de jours de suspension (1-365).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Suspension..." : "Suspendre"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
