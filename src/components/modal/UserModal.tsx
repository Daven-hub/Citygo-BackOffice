"use client"

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
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import { Loader } from "lucide-react"
import { registerApp } from "@/store/slices/auth.slice"
import { getAllUsers } from "@/store/slices/user.slice"

// type FormValues = {
//   nom: string
//   prenom?: string
//   password?: string
//   email: string
//   username?: string
//   profile?: string
//   gender?: string
//   birthday?: string
//   role?: "admin" | "user"
//   status?: boolean
// }

export default function UserModal({ toast, dispatch, open, setOpen }) {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            status: true,
            role: "admin",
        },
    })

    const onSubmit = async (datas) => {
        // console.log("Form Data:", data)
        setLoading(true);
        try {
            const datamodel = new FormData()
            for (const key in datas) {
                if (key === 'profile') {
                    if (datas.profile && datas.profile.length > 0) {
                        datamodel.append('profile', datas?.profile?.[0])
                    }
                } else if (datas[key] !== undefined && datas[key] !== null) {
                    datamodel.append(key, datas[key])
                }
            }
            await dispatch(registerApp(datamodel)).unwrap();
            dispatch(getAllUsers()).unwrap();
            toast({
                title: "Enregistrement",
                description: "Utilisateur créé avec success!",
            });
            reset()
        } catch (error) {
            toast({
                title: "Enregistrement",
                description: error?.toString(),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
        // reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Créer un Utilisteur</DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom*</label>
                            <Input
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("nom", { required: "Nom is required" })}
                            />
                            {errors.nom && (
                                <p className="text-xs text-red-500">{errors.nom.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <Input
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("prenom")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email*</label>
                            <Input
                                type="email"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <Input
                                type="text"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("username")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("password")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile URL</label>
                            <Input
                                type="file"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("profile")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Masculin</SelectItem>
                                            <SelectItem value="F">Féminin</SelectItem>
                                            <SelectItem value="O">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Birthday</label>
                            <Input
                                type="date"
                                className="mt-1 block w-full rounded-md border p-2"
                                {...register("birthday")}
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center col-span-2 space-x-2">
                            <Input
                                type="checkbox"
                                {...register("status")}
                                className="h-4 w-4 rounded border"
                            />
                            <span className="text-sm text-gray-700">Active le profile de l'utilisateur</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 border-t pt-3 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button disabled={loading} type="submit" className="!bg-green-700 text-white">
                            {loading ? <Loader /> : 'Sauvegarder'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
