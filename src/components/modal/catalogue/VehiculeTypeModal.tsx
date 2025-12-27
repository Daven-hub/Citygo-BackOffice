import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
// import { Input } from "../ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createVehicleType, updateVehicleType } from "@/store/slices/catalogue/vehicleType.slice"
import { useToast } from "@/hook/use-toast"

export default function VehiculeTypeModal({open, setOpen, dispatch, selectedTypeVehicle, setSelectedTypeVehicle }) {
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
            seatCapacityMin:1,
            seatCapacityMax:1,
        },
    })

    useEffect(() => {
    if (selectedTypeVehicle) {
      reset({
        active: selectedTypeVehicle.active,
        sortOrder: selectedTypeVehicle.sortOrder ?? 0,
        code: selectedTypeVehicle.code ?? "",
        name: selectedTypeVehicle.name ?? "",
        seatCapacityMin: Number(selectedTypeVehicle.seatCapacityMin ?? 1),
        seatCapacityMax: Number(selectedTypeVehicle.seatCapacityMax ?? 1),
      });
    }
  }, [selectedTypeVehicle, reset]);


    const onSubmit = async (datas) => {
        const {active,...data}=datas
        const newData=selectedTypeVehicle?datas:data
        setLoading(true);
        try {
            if(!selectedTypeVehicle){
                await dispatch(createVehicleType(newData)).unwrap();
                toast({
                    title: "Nouvel Enregistrement",
                    description: "Le type de vehicule"+newData.code+" a été créé avec success!",
                });
            }else{
                const newsData={id:selectedTypeVehicle?.id,datas:newData}
                await dispatch(updateVehicleType(newsData)).unwrap();
                toast({
                    title: "Modification",
                    description: "Le type de vehicule "+newData.code+" a été modifié avec success!",
                });
            }
            setOpen(false)
            reset({})
            setSelectedTypeVehicle(null)
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
                <DialogTitle className="text-[1.3rem] font-semibold">Nouveau Type de véhicule</DialogTitle>

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

                        <div className="space-y-0">
                            <label className="block text-sm font-medium text-gray-700">Capacité Minimale</label>
                            <Input
                                min={1}
                                type="number"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("seatCapacityMin", { required: "Capacité Minimale est require" })}
                            />
                            {errors.seatCapacityMin && (
                                <p className="text-xs text-red-500">{errors.seatCapacityMin.message}</p>
                            )}
                        </div>

                        <div className="space-y-0">
                            <label className="block text-sm font-medium text-gray-700">Capcaité Maximale</label>
                            <Input
                                min={1}
                                type="number"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("seatCapacityMax")}
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
                        {selectedTypeVehicle && <div className="flex items-center col-span-2 space-x-2">
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
