import React, { useEffect, useMemo, useState } from "react";

import {
  ChevronDown,
  Edit,
  Trash2,
  DownloadCloud,
  Plus,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useToast } from "@/hook/use-toast";
import { getAllUsers, updateUser } from "@/store/slices/user.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BaseUrl } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumb";

function Passager() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loadTime, setLoadTime] = useState(0);
  const [search, setSearch] = useState("");


  const datas = [
    {
      id: "1",
      userId: "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      profile: {
        displayName: "Kouadio Arnaud",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        locale: "fr_FR",
        bio: "Conducteur expérimenté basé à yaounde.",
        driverVerified: true,
      },
      flags: {
        canPublishRides: true,
        banned: false,
      },
      createdAt: "2023-05-10T08:20:00Z",
    },
    {
      id: "2",
      userId: "5a92ad8c-7c02-481a-b0aa-0d15e85b129e",
      profile: {
        displayName: "Aïssata Koné",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        locale: "fr_FR",
        bio: "Partage ses trajets entre douala.",
        driverVerified: false,
      },
      flags: {
        canPublishRides: true,
        banned: true,
      },
      createdAt: "2023-09-01T11:00:10Z",
    },
    {
      id: "3",
      userId: "b8df72e2-d289-4a8d-a69f-4885af87ed89",
      profile: {
        displayName: "Serge N’Guessan",
        avatarUrl: "https://randomuser.me/api/portraits/men/83.jpg",
        locale: "fr_FR",
        bio: "Nouveau conducteur, motivé et ponctuel.",
        driverVerified: true,
      },
      flags: {
        canPublishRides: false,
        banned: false,
      },
      createdAt: "2024-01-12T09:30:00Z",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      try {
        await Promise.all([dispatch(getAllUsers()).unwrap()]);
        const end = performance.now();
        const duration = end - start;
        setLoadTime(parseInt(duration.toFixed(0)));
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

 
  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={loadTime} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex px-5 py-2 rounded-[10px] bg-white justify-between items-center">
        <h1 className="flex items-center text-gray-700 md:text-[1.25rem] font-medium gap-1.5">
          <User size={22} />
          Passagers{" "}
        </h1>
        <Breadcrumb />
      </div>
      <div className="flex flex-col gap-4 rounded-[6px] py-0.5">
        <div className="flex justify-between items-center gap-4">
          <div className="flex w-[30%] items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border bg-white text-[.87rem] py-2.5 rounded-[7px] outline-0 px-5 w-full md:w-[100%]"
              type="text"
              placeholder="Recherchez ..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="py-2 px-4 flex items-center gap-1.5 text-[.85rem] rounded-[7px] border border-red-600 bg-white font-semibold text-red-600">
              <DownloadCloud size={16} /> pdf
            </button>
          </div>
        </div>
        <div className="rounded-[7px] overflow-hidden bg-white border">
          <Table>
            <TableHeader className="text-black border-b">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Locale</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Vérifié</TableHead>
                <TableHead>Banni</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-7">
                    Pas de résultat
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((user, index) => (
                  <TableRow
                    key={user.userId}
                    className="hover:bg-primary/5 cursor-pointer"
                  >
                    <TableCell>{index + 1}</TableCell>

                    {/* User avatar + name */}
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profile.avatarUrl} />
                        <AvatarFallback>
                          {user.profile.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.profile.displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.userId.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{user.profile.locale}</TableCell>

                    <TableCell className="max-w-[200px] truncate">
                      {user.profile.bio}
                    </TableCell>

                    {/* Verified badge */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.profile.driverVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {user.profile.driverVerified ? "Oui" : "Non"}
                      </span>
                    </TableCell>

                    {/* Banned */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.flags.banned
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.flags.banned ? "Banni" : "Actif"}
                      </span>
                    </TableCell>

                    {/* Created at */}
                    <TableCell>
                      {dayjs(user.createdAt).format("DD/MM/YYYY")}
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-blue-700">
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Passager;
