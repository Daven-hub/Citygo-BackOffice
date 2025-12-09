import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Image,
  Download
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KYCRequestStatusModal } from "@/components/modal/KYCRequestStatusModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mockKYCRequests, kycStatusConfig, documentTypeConfig } from "@/data/mockKYC";

export default function KYCRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const request = mockKYCRequests.find(r => r.id === requestId);

  if (!request) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Demande non trouvée</h2>
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
      title: data.status === "APPROVED" ? "Demande validée" : "Demande rejetée",
      description: `La demande KYC de ${request.userName} a été mise à jour.`,
    });
  };

  const StatusIcon = request.status === "APPROVED" ? CheckCircle : 
                     request.status === "REJECTED" ? XCircle : Clock;

  return (
    <>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/kyc")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux demandes KYC
        </Button>

        {/* Header Card */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-accent/10 text-accent text-xl font-semibold">
                    {request.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{request.userName}</h2>
                  <p className="text-muted-foreground">{request.userEmail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("font-medium", kycStatusConfig[request.status].className)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {kycStatusConfig[request.status].label}
                    </Badge>
                    <Badge variant="outline" className={cn("font-medium", documentTypeConfig[request.documentType].className)}>
                      {documentTypeConfig[request.documentType].label}
                    </Badge>
                  </div>
                </div>
              </div>
              {request.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button 
                    className="bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Valider
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Informations du document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type de document</p>
                    <Badge variant="outline" className={cn("font-medium mt-1", documentTypeConfig[request.documentType].className)}>
                      {documentTypeConfig[request.documentType].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro de document</p>
                    <p className="font-mono font-medium text-foreground">{request.documentNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Preview */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Image className="w-5 h-5 text-primary" />
                  Aperçu du document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Document soumis par l'utilisateur</p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le document
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Reason (if rejected) */}
            {request.status === "REJECTED" && request.rejectionReason && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Raison du rejet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{request.rejectionReason}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Informations utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-foreground">{request.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{request.userEmail}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate(`/users/${request.userId}`)}
                >
                  Voir le profil complet
                </Button>
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
                      <p className="font-medium text-foreground">Demande soumise</p>
                      <p className="text-sm text-muted-foreground">{formatDate(request.submittedAt)}</p>
                    </div>
                  </div>
                  {request.reviewedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          request.status === "APPROVED" ? "bg-success" : "bg-destructive"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {request.status === "APPROVED" ? "Validée" : "Rejetée"}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(request.reviewedAt)}</p>
                        {request.reviewedBy && (
                          <p className="text-sm text-muted-foreground">par {request.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* IDs */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Identifiants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">ID Demande</p>
                  <p className="font-mono text-sm text-foreground">{request.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Utilisateur</p>
                  <p className="font-mono text-sm text-foreground">{request.userId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <KYCRequestStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        requestId={request.id}
        currentStatus={request.status}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
}
