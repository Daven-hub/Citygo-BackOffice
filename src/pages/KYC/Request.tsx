import Pagination from "@/components/Pagination";
import { StatsCard } from "@/components/StatsCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentTypeConfig, DriverApplication, KYCRequest, kycStatusConfig } from "@/data/mockKYC";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utilis/formatDate";
import { CheckCircle, Clock, Eye, FileText, Filter, Search, UserCheck, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Request({kycStats,users, statusFilter,setStatusFilter ,searchQuery,setSearchQuery,paginatedKYCRequests,totalPages, setPage,page, pageSize,setSelectedKYCRequest,setKycStatusModalOpen}) {
    const navigate=useNavigate()
    const handleUpdateKYCStatus = (req: KYCRequest) => {
    setSelectedKYCRequest(req);
    setKycStatusModalOpen(true);
  };

  const getNameUser=(y)=>{
    return users?.find((x)=>x.id===y).displayName
  }
  return (
    <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total demandes" value={kycStats.total.toString()} icon={FileText} />
              <StatsCard title="En attente" value={kycStats.pending.toString()} icon={Clock} trend={{ value: kycStats.pending, isPositive: false }} />
              <StatsCard title="Validées" value={kycStats.approved.toString()} icon={CheckCircle} trend={{ value: 12, isPositive: true }} />
              <StatsCard title="Rejetées" value={kycStats.rejected.toString()} icon={XCircle} />
              {/* <StatsCard title="Expired" value={kycStats.rejected.toString()} icon={XCircle} /> */}
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une demande KYC..."
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
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Soumis le</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Gerer Par</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Examiné le</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedKYCRequests.map((req) => (
                      <tr key={req.kycRequestId} className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                                {req.user.displayName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="">
                              <p className="font-medium text-foreground">{req.user.displayName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-muted-foreground text-sm">{formatDate(req.submittedAt)}</td>
                        <td className="py-3 px-6 text-muted-foreground text-sm">{req.reviewedBy?getNameUser(req.reviewedBy):'N/A'}</td>
                        <td className="py-3 px-6">
                          <Badge variant="outline" className={cn("font-medium whitespace-nowrap", kycStatusConfig[req.status].className)}>
                            {kycStatusConfig[req.status].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-6 text-sm text-muted-foreground">{req.reviewedAt?formatDate(req.reviewedAt):'N/A'}</td>
                        <td className="py-3 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => navigate(`/kyc/demande/${req.kycRequestId}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                            {/* {req.status === "PENDING" && ( */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleUpdateKYCStatus(req)}
                              >
                                Traiter
                              </Button>
                            {/* )} */}
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

export default Request
