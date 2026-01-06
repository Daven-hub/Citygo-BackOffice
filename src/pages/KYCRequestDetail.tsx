import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Image,
  Download,
  Phone,
  MoveLeft,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KYCRequestStatusModal, KYCType } from "@/components/modal/KYCRequestStatusModal";
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  kycStatusConfig,
  documentTypeConfig,
} from "@/data/mockKYC";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getKycRequestById, updateKycRequest } from "@/store/slices/kyc.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { formatDate } from "@/utilis/formatDate";
import { getAllDocuments } from "@/store/slices/document.slice";
import { GetAllUsers } from "@/store/slices/user.slice";

export default function KYCRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { requestsId } = useAppSelector((state) => state.kyc);
  const { documents } = useAppSelector((state) => state.document);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(getKycRequestById(requestId)),
        dispatch(getAllDocuments()),
        dispatch(GetAllUsers())
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, requestId]);

  const myDocument=documents?.filter((x)=>x.owner.userId===requestsId?.userId)
    console.log('myDocument',myDocument)
     console.log('requestsId',requestsId)

  const handleKYCStatusSubmit = async(data: { status: "APPROVED" | "REJECTED"; rejectionReasons: string[]; documentUpdates:KYCType[] }) => {
        setLoading(true);
          try {
            const datas={
              id:requestId,
              datas:data
            }
            await dispatch(updateKycRequest(datas)).unwrap();
            setStatusModalOpen(false)
            toast({
              title: data.status === "APPROVED" ? "Demande validée" : "Demande rejetée",
              description: `La demande KYC de ${requestsId?.user.displayName} a été mise à jour.`,
            });
          } catch (error) {
            toast({
              description: error?.toString(),
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
    };

    const getUser=(x)=>{
      return users?.find((y)=>y.id===x)
    }


  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  if (!requestsId) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Demande non trouvée
            </h2>
            <Button variant="outline" onClick={() => navigate("/kyc")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </>
    );
  }

  const StatusIcon =
    requestsId.status === "APPROVED"
      ? CheckCircle
      : requestsId.status === "REJECTED"
      ? XCircle
      : Clock;

  return (
    <>
      <div className="space-y-3">
        {/* Back button */}
        <Button
          onClick={() => navigate("/kyc")}
          className="bg-transparent"
        >
          <MoveLeft className="w-4 h-4 mr-0.5" />
          Retour aux demandes KYC
        </Button>

        {/* Header Card */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {requestsId.user.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {requestsId.user.displayName}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {getUser(requestsId.userId).phone}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        kycStatusConfig[requestsId.status].className
                      )}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {kycStatusConfig[requestsId.status].label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium"
                      )}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Document(s) soumis : {myDocument.length}
                    </Badge>
                  </div>
                </div>
              </div>
                <div className="flex gap-2">
                  {requestsId.status === "APPROVED" && <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>}
                  {requestsId.status === "REJECTED" && <Button
                    className="bg-success hover:bg-success/90 text-white"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Valider
                  </Button>}
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Document Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Document Soumis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Type de document
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium mt-1",
                        documentTypeConfig[requestsId?.documentType]?.className
                      )}
                    >
                      {documentTypeConfig[requestsId?.documentType]?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Numéro de document
                    </p>
                    <p className="font-mono font-medium text-foreground">
                      {requestsId?.documentNumber}
                    </p>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {requestsId.status === "REJECTED" && requestsId.rejectionReasons.length>0 && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex text-xl items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Raison du rejet
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                 <ol className="relative border-l border-border pl-6 space-y-6">
                  {requestsId.rejectionReasons.map((reason, index) => (
                    <li key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-destructive bg-background" />

                      {/* Content */}
                      <div className="space-y-0.5">
                        <p className="text-sm text-foreground first-letter:uppercase leading-relaxed">
                          {reason}
                        </p>

                        <span className="text-xs text-muted-foreground">
                          Rejet #{index + 1}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* User Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Informations utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-foreground">
                      {requestsId.user.displayName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {getUser(requestsId.userId).phone}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2.5"
                  onClick={() => navigate(`/users/${requestsId.userId}`)}
                >
                  Voir le profil complet
                </Button>
              </CardContent>
            </Card>
            {/* Timeline */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex items-center flex-col">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="ml-0 w-0.5 h-[calc(100%-0.75rem)] bg-primary/20" />
                    </div>
                    <div className="">
                      <p className="font-medium text-foreground">
                        Demande soumise
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(requestsId.submittedAt)}
                      </p>
                    </div>
                  </div>
                  {requestsId.reviewedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            requestsId.status === "APPROVED"
                              ? "bg-success"
                              : "bg-destructive"
                          )}
                        />
                        <div className="ml-0 w-0.5 h-[calc(100%-0.75rem)] bg-primary/20" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {requestsId.status === "APPROVED"
                            ? "Validée"
                            : "Rejetée"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(requestsId.reviewedAt)}
                        </p>
                        {requestsId.reviewedBy && (
                          <p className="text-sm text-muted-foreground">
                            par {getUser(requestsId.reviewedBy).displayName}
                          </p>
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
                  <p className="font-mono text-sm text-foreground">
                    {requestId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    ID Utilisateur
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    {requestsId.userId}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <KYCRequestStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        requestId={requestId}
        userId={requestsId?.userId}
        currentStatus={requestsId.status}
        loading={loading}
        doc={documents}
        onSubmit={handleKYCStatusSubmit}
      />
    </>
  );
}
