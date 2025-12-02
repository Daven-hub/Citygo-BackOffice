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
// import UserModal from '@/components/modal/UserModal'
// import useDeviceInfo from '@/hook/useDeviceInfo'
import { useNavigate } from "react-router-dom";

function Drivers() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTime, setLoadTime] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const applications = [
    {
      id: "1",
      licenseNumber: "LIC-45821",
      licenseExpiryDate: "2026-04-12",
      experience: 3,
      motivation:
        "Je souhaite devenir conducteur pour offrir un service fiable.",
      emergencyContact: {
        name: "Diallo Mamadou",
        phone: "+2376789055",
        relationship: "Frère",
      },
      applicationId: "97ab27fa-30e2-43e3-92a3-160e80f4c0d5",
      status: "PENDING",
      submittedAt: "2024-10-21T14:15:22Z",
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    },
    {
      id: "2",
      licenseNumber: "LIC-98211",
      licenseExpiryDate: "2025-09-08",
      experience: 5,
      motivation: "Expérience solide et professionnalisme.",
      emergencyContact: {
        name: "Koné Aïssata",
        phone: "+23765060708",
        relationship: "Épouse",
      },
      applicationId: "82ab27fa-30e2-43e3-92a3-160e80f4c0aa3",
      status: "APPROVED",
      submittedAt: "2024-10-10T10:05:10Z",
      reviewedAt: "2024-10-12T15:11:10Z",
      reviewedBy: "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
      rejectionReason: null,
    },
    {
      id: "3",
      licenseNumber: "LIC-22189",
      licenseExpiryDate: "2024-11-01",
      experience: 1,
      motivation: "Intérêt pour le transport urbain.",
      emergencyContact: {
        name: "Yao Serge",
        phone: "+23767080910",
        relationship: "Ami",
      },
      applicationId: "72ab27fa-30e2-43e3-92a3-160e80f44990",
      status: "REJECTED",
      submittedAt: "2024-09-20T08:00:10Z",
      reviewedAt: "2024-09-21T12:00:00Z",
      reviewedBy: "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
      rejectionReason: "Documents non conformes",
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

  const filterClient = useMemo(() => {
    const lowerSearch = search?.toLowerCase();
    return users.filter(
      (cat) =>
        cat?.nom?.toLowerCase()?.includes(lowerSearch) ||
        cat?.prenom?.toLowerCase()?.includes(lowerSearch) ||
        cat?.email?.toLowerCase()?.includes(lowerSearch) ||
        cat?.adresse?.toLowerCase()?.includes(lowerSearch) ||
        cat?.username?.toLowerCase()?.includes(lowerSearch)
    );
  }, [users, search]);

  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={loadTime} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex px-5 py-2 rounded-[10px] bg-white justify-between items-center">
        <h1 className="flex items-center text-gray-700 md:text-[1.25rem] font-medium gap-1.5">
          <User size={22} />
          Drivers{" "}
        </h1>
        <Breadcrumb />
      </div>
      {/* <ClientStats data={data}></ClientStats> */}
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
                <TableHead>Numéro Permis</TableHead>
                <TableHead>Expérience</TableHead>
                <TableHead>Motivation</TableHead>
                <TableHead>Contact d’urgence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Soumis le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-7">
                    Pas de résultat
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-primary/5 cursor-pointer"
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{item.licenseNumber}</TableCell>

                    <TableCell>{item.experience} ans</TableCell>

                    <TableCell className="max-w-[200px] truncate">
                      {item.motivation}
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {item.emergencyContact.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.emergencyContact.phone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`
                px-3 py-1 rounded-full text-xs capitalize font-medium 
                ${
                  item.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : item.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              `}
                      >
                        {item.status.toLowerCase()}
                      </span>
                    </TableCell>

                    <TableCell>
                      {dayjs(item.submittedAt).format("DD/MM/YYYY")}
                    </TableCell>

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
                          <DropdownMenuSeparator className="bg-black/10" />

                          <DropdownMenuItem className="text-blue-700">
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
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

export default Drivers;
