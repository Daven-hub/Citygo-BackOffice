import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Calendar, 
  Clock, 
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DriverApplicationStatusModal } from "@/components/modal/DriverApplicationStatusModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mockDriverApplications, kycStatusConfig } from "@/data/mockKYC";

export default function DriverApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const application = mockDriverApplications.find(a => a.id === applicationId);

  if (!application) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Candidature non trouvée</h2>
            <Button variant="outline" onClick={() => navigate("/kyc")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleStatusSubmit = (data: { status: "APPROVED" | "REJECTED"; reason: string }) => {
    toast({
      title: data.status === "APPROVED" ? "Candidature approuvée" : "Candidature rejetée",
      description: `La candidature de ${application.userName} a été mise à jour.`,
    });
  };

  const StatusIcon = application.status === "APPROVED" ? CheckCircle : 
                     application.status === "REJECTED" ? XCircle : Clock;

  return (
    <>
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/kyc")} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux candidatures
        </Button>

        {/* Header Card */}
        <Card className="border-border shadow-none bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {application.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-black/65 text-foreground">{application.userName}</h2>
                  <p className="text-sm text-muted-foreground">{application.userEmail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("font-medium text-xs", kycStatusConfig[application.status].className)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {kycStatusConfig[application.status].label}
                    </Badge>
                  </div>
                </div>
              </div>
              {application.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-2 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Rejeter
                  </Button>
                  <Button 
                    className="bg-success hover:bg-success/90 text-white"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approuver
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

          <div className="lg:col-span-2 space-y-3">
            <Card className="border-border shadow-none bg-card">
              <CardHeader>
                <CardTitle className="flex relative items-center text-2xl text-black/65 gap-2">
                  <CreditCard className="w-5 h-5 mr-1 text-primary" />
                  Informations du permis
                  <Badge variant="outline" className={`mt-0 absolute right-4 ${new Date(application.licenseExpiryDate) < new Date()?'bg-destructive/10 text-destructive border-destructive/20':'bg-green-100 text-green-700 border-green-200'}`}>
                    {new Date(application.licenseExpiryDate) < new Date()?'Expiré':'Actif'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro de permis</p>
                    <p className="font-mono font-medium text-foreground">{application.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'expiration</p>
                    <p className="font-medium text-foreground">
                      {new Date(application.licenseExpiryDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience & Motivation */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Expérience & Motivation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Années d'expérience</p>
                  <p className="font-medium text-foreground text-2xl">{application.experience} ans</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Motivation</p>
                  <p className="text-foreground bg-muted/30 p-4 rounded-lg">{application.motivation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Reason (if rejected) */}
            {application.status === "REJECTED" && application.rejectionReason && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Raison du rejet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{application.rejectionReason}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact d'urgence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-foreground">{application.emergencyContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium text-foreground">{application.emergencyContact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Relation</p>
                    <p className="font-medium text-foreground">{application.emergencyContact.relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-foreground">Candidature soumise</p>
                      <p className="text-sm text-muted-foreground">{formatDate(application.submittedAt)}</p>
                    </div>
                  </div>
                  {application.reviewedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          application.status === "APPROVED" ? "bg-success" : "bg-destructive"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {application.status === "APPROVED" ? "Approuvée" : "Rejetée"}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(application.reviewedAt)}</p>
                        {application.reviewedBy && (
                          <p className="text-sm text-muted-foreground">par {application.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application ID */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Identifiants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">ID Candidature</p>
                  <p className="font-mono text-sm text-foreground break-all">{application.applicationId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Utilisateur</p>
                  <p className="font-mono text-sm text-foreground">{application.userId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DriverApplicationStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        applicationId={application.id}
        currentStatus={application.status}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
}
