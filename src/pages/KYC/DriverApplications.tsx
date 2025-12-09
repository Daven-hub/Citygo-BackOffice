import Pagination from "@/components/Pagination";
import { StatsCard } from "@/components/StatsCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DriverApplication, kycStatusConfig } from "@/data/mockKYC";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utilis/formatDate";
import { CheckCircle, Clock, Eye, Filter, Search, UserCheck, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function DriverApplications({appStats, totalPages, setPage,page, pageSize,setSelectedApplication,setAppStatusModalOpen,searchQuery,setSearchQuery,paginatedApplications}) {
    const navigate=useNavigate()
    const {toast}=useToast()
     const handleUpdateAppStatus = (app: DriverApplication) => {
        setSelectedApplication(app);
        setAppStatusModalOpen(true);
      };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total candidatures"
          value={appStats.total.toString()}
          icon={UserCheck}
        />
        <StatsCard
          title="En attente"
          value={appStats.pending.toString()}
          icon={Clock}
          trend={{ value: appStats.pending, isPositive: false }}
        />
        <StatsCard
          title="Approuvées"
          value={appStats.approved.toString()}
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Rejetées"
          value={appStats.rejected.toString()}
          icon={XCircle}
        />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une candidature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Button variant="outline" size="icon" className="border-border">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Candidat
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  N° Permis
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Expérience
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Soumis le
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Statut
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b text-sm border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {app.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {app.userName}
                        </p>
                        <p className="text-muted-foreground">{app.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-mono text-sm text-foreground">
                    {app.licenseNumber}
                  </td>
                  <td className="py-3 px-6 text-foreground">
                    {app.experience} ans
                  </td>
                  <td className="py-3 px-6 text-muted-foreground">
                    {formatDate(app.submittedAt)}
                  </td>
                  <td className="py-3 px-6">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium whitespace-nowrap",
                        kycStatusConfig[app.status].className
                      )}
                    >
                      {kycStatusConfig[app.status].label}
                    </Badge>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => navigate(`/kyc/applications/${app.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      {app.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleUpdateAppStatus(app)}
                        >
                          Traiter
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          onPageChange={setPage}
          page={page}
          pageSize={pageSize}
          total={totalPages}
          className=""
        />
      </div>
    </>
  );
}

export default DriverApplications;
