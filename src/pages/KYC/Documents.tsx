import Pagination from "@/components/Pagination";
import { StatsCard } from "@/components/StatsCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Document } from "@/store/slices/document.slice";
import { formatDate } from "@/utilis/formatDate";
import { CheckCircle, Clock, Edit, Eye, FileText, Filter, Search, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";


export interface StatsDoc{
    total:number,
    approved:number,
    pending:number,
    expired:number,
    rejected:number
}

const DocumentConfig = {
  PENDING: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approuvé", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" }
};
export interface DocumentsProps {
  documentStats: StatsDoc;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  paginatedData: Document[];
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setSelected: React.Dispatch<React.SetStateAction<Document | null>>;
  setStatusModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Documents({documentStats, statusFilter,setStatusFilter ,searchQuery,setSearchQuery,paginatedData,totalPages, setPage,page, pageSize,setSelected,setStatusModalOpen}:DocumentsProps) {
    const navigate=useNavigate()

    const handleActiveStatusModal = (req: Document) => {
        setSelected(req);
        setStatusModalOpen(true);
    };

  return (
    <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <StatsCard title="Total Documents" value={documentStats.total.toString()} icon={FileText} />
              <StatsCard title="En attente" value={documentStats.pending.toString()} icon={Clock} trend={{ value: documentStats.pending, isPositive: false }} />
              <StatsCard title="Validés" value={documentStats.approved.toString()} icon={CheckCircle} trend={{ value: 12, isPositive: true }} />
              <StatsCard title="Rejetés" value={documentStats.rejected.toString()} icon={XCircle} />
              <StatsCard title="Expirés" value={documentStats.expired.toString()} icon={XCircle} />
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-44 border-border text-foreground">
                    <Filter className="h-4 w-4 mr-0.5 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="all" className="text-foreground">Tous les statuts</SelectItem>
                    <SelectItem value="APPROVED" className="text-success">Approuvé</SelectItem>
                    <SelectItem value="PENDING" className="text-warning">En attente</SelectItem>
                    <SelectItem value="REJECTED" className="text-destructive">Rejété</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Utilisateur</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Owner Type</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Catégorie</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Créer le</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((req) => (
                      <tr key={req.documentId} className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                                {req.owner.displayName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="">
                              <p className="font-medium text-foreground">{req.owner.displayName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 font-mono text-sm text-foreground">{req.ownerType}</td>
                        <td className="py-3 px-6 text-muted-foreground text-sm">{req.type}</td>
                        <td className="py-3 px-6 text-muted-foreground text-sm">{req.category}</td>
                        <td className="py-3 px-6">
                          <Badge variant="outline" className={cn("font-medium whitespace-nowrap", DocumentConfig[req.state].className)}>
                            {DocumentConfig[req.state].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-6 text-muted-foreground text-sm">{formatDate(req.createdAt)}</td>
                        <td className="py-3 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => navigate(`/documents/${req.documentId}`)}
                            >
                              <Eye className="w-4 h-4 mr-0" />
                              Détails
                            </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleActiveStatusModal(req)}
                              >
                                <Edit className="w-4 h-4 mr-0" />
                                Traiter
                              </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination onPageChange={setPage} page={page} pageSize={pageSize} total={totalPages} className="" />
            </div>
    </>
  )
}

export default Documents
