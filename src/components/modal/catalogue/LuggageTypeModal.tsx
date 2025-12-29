import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hook/use-toast"
import { createLuggage, updateLuggage } from "@/store/slices/catalogue/luggageType.slice"

export default function LuggageTypeModal({open, setOpen, dispatch, selected, setSelected }) {
    const [loading, setLoading] = useState(false)
    const {toast}=useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            active: true,
            sortOrder:0,
            code: "",
            name:"",
        },
    })

    useEffect(() => {
    if (selected) {
      reset({
        active: selected.active,
        sortOrder: selected.sortOrder ?? 0,
        code: selected.code ?? "",
        name: selected.name ?? "",
      });
    }
  }, [selected, reset]);


    const onSubmit = async (datas) => {
        const {active,...data}=datas
        const newData=selected?datas:data
        setLoading(true);
        try {
            if(!selected){
                await dispatch(createLuggage(newData)).unwrap();
                toast({
                    title: "Nouvel Enregistrement",
                    description: "Le type de bagage "+newData.code+" a été créé avec success!",
                });
            }else{
                const newsData={id:selected?.id,datas:newData}
                await dispatch(updateLuggage(newsData)).unwrap();
                toast({
                    title: "Modification",
                    description: "Le type de Bagage "+newData.code+" a été modifié avec success!",
                });
            }
            setOpen(false)
            reset({})
            setSelected(null)
        } catch (error) {
            toast({
                description: error?.toString(),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle className="text-[1.3rem] font-semibold">Nouveau Type de Bagage</DialogTitle>

                <form id='typeVehicule' onSubmit={handleSubmit(onSubmit)} className="mt-2">
                    <div className="grid text-sm grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-0">
                            <label className="block text-sm font-medium text-gray-700">Code*</label>
                            <Input
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("code", { required:true })}
                            />
                            {errors.code && (
                                <p className="text-xs mt-0.5 text-red-500">{"Code is required"}</p>
                            )}
                        </div>

                        <div className="col-span-2 space-y-0">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <Input
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("name")}
                            />
                        </div>


                        <div className="col-span-2 space-y-0">
                            <label className="block text-sm font-medium text-gray-700">Ordre</label>
                            <Input
                                type="number"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("sortOrder")}
                            />
                        </div>

                        {/* Status */}
                        {selected && <div className="flex items-center col-span-2 space-x-2">
                            <Input
                                type="checkbox"
                                {...register("active")}
                                className="h-4 w-4 rounded border"
                            />
                            <span className="text-sm text-gray-700">Active ?</span>
                        </div>}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 border-t pt-3 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button disabled={loading} formTarget="#typeVehicule" type="submit" className="!bg-green-700 flex items-center gap-2 text-white">
                            {loading ? <><Loader /> Sauvegarde en cour ...</> : 'Sauvegarder'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
