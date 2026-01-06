import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Phone,
  MoveLeft,
} from "lucide-react";

const DocumentPreview = ({ doc }) => {
  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">
            {documentTypeConfig[doc.type]?.label}
          </p>
          <p className="text-xs text-muted-foreground">
            Soumis le {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="outline">{doc.state}</Badge>
      </div>

      {/* Preview */}
      <div className="rounded-lg border bg-black p-2 flex justify-center">
        {doc.mimeType.startsWith("image/") ? (
          <img
            src={doc.url}
            alt={doc.fileName}
            className="max-h-[320px] rounded object-contain"
          />
        ) : doc.mimeType === "application/pdf" ? (
          <iframe
            src={doc.url}
            className="h-[320px] w-full rounded"
          />
        ) : (
          <a
            href={doc.url}
            target="_blank"
            className="text-primary underline"
          >
            Télécharger le document
          </a>
        )}
      </div>

      {/* Meta infos */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Propriétaire</p>
          <p>{doc.owner?.displayName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Taille</p>
          <p>{(doc.fileSize / 1024).toFixed(1)} KB</p>
        </div>
      </div>
    </div>
  );
};

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
import { Document, getAllDocuments } from "@/store/slices/document.slice";
import { GetAllUsers } from "@/store/slices/user.slice";
import { KYCDocumentPreviewModal } from "@/components/modal/KYCDocumentPreviewModal";

export default function KYCRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  const { requestsId } = useAppSelector((state) => state.kyc);
  const { documents } = useAppSelector((state) => state.document);
  const { users } = useAppSelector((state) => state.users);
  const [selectedDoc, setSelectedDoc] = useState(documents?.[0] || null);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(getKycRequestById(requestId)),
        dispatch(getAllDocuments()),
        dispatch(GetAllUsers({ page: 0, size: 10000 }))
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, requestId]);

  const myDocument = documents?.filter((x) => x.owner.userId === requestsId?.userId && x.category==='IDENTITY')

  const handleKYCStatusSubmit = async (data: { status: "APPROVED" | "REJECTED"; rejectionReasons: string[]; documentUpdates: KYCType[] }) => {
    setLoading(true);
    try {
      const datas = {
        id: requestId,
        datas: data
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

  const getUser = (x) => {
    return users?.find((y) => y.id === x)
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

  const handleDocumentStatusChange = (documentId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    toast({
      title: status === "APPROVED" ? "Document approuvé" : "Document rejeté",
      description: `Le document a été ${status === "APPROVED" ? "approuvé" : "rejeté"}.`,
    });
  };

  const openDocumentPreview = (doc: Document, index: number) => {
    setSelectedDocument(doc);
    setActiveDocumentIndex(index);
    setDocumentPreviewOpen(true);
  };

  const navigateDocument = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? Math.max(0, activeDocumentIndex - 1)
      : Math.min(myDocument.length - 1, activeDocumentIndex + 1);
    setActiveDocumentIndex(newIndex);
    setSelectedDocument(myDocument[newIndex]);
  };

  const StatusIcon =
    requestsId.status === "APPROVED"
      ? CheckCircle
      : requestsId.status === "REJECTED"
        ? XCircle
        : Clock;

  return (
    <>
      <div className="space-y-3">
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
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {requestsId.user.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-[1.1rem] leading-[1.1] font-bold text-terciary/70">
                    {requestsId.user.displayName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {getUser(requestsId.userId).phone}
                  </p>
                  <div className="flex items-center gap-2">
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
                        "font-medium text-sm"
                      )}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Document(s) soumis : &nbsp;<mark className="bg-transparent text-primary">{myDocument.length}</mark>
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
                  <XCircle className="w-4 h-4 mr-0.5" />
                  Rejeter
                </Button>}
                {requestsId.status === "REJECTED" && <Button
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => setStatusModalOpen(true)}
                >
                  <CheckCircle className="w-4 h-4 mr-0.5" />
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
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-1 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents soumis
                  <span className="text-sm text-muted-foreground">
                    ({myDocument.length})
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="!pt-0">
                <div className="grid pt-4 border-t border-gray-100 grid-cols-12 gap-6">
                  {/* Liste */}
                  <div className="col-span-12 space-y-2">
                    {myDocument.map((doc,index) => (
                      <button
                        key={doc.documentId}
                        onClick={() => openDocumentPreview(doc, index)}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left transition",
                          selectedDoc?.documentId === doc.documentId
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {documentTypeConfig[doc.type]?.label || doc.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.fileName}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className={cn(
                              doc.state === "APPROVED" && "text-success border-success/40",
                              doc.state === "REJECTED" && "text-destructive border-destructive/40",
                              doc.state === "PENDING" && "text-warning border-warning/40"
                            )}
                          >
                            {doc.state}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Preview */}
                  {/* <div className="col-span-7">
                    {selectedDoc ? (
                      <DocumentPreview doc={selectedDoc} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Sélectionnez un document
                      </div>
                    )}
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {requestsId.status === "REJECTED" && requestsId.rejectionReasons.length > 0 && (
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
            {/* <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Informations utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 !pt-0">
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-medium text-sm text-terciary">
                        {requestsId.user.displayName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm text-foreground">
                        {getUser(requestsId.userId).phone}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full !text-xs mt-5"
                  onClick={() => navigate(`/users/${requestsId.userId}`)}
                >
                  Voir le profil complet
                </Button>
              </CardContent>
            </Card> */}

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 !pt-0">
                <div className="space-y-3 pt-3 border-t border-gray-100">
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
                        <p className={cn("font-medium text-foreground", requestsId.status === "APPROVED"
                          ? "text-success"
                          : "text-destructive")}>
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

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex text-xl items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Identifiants
                </CardTitle>
              </CardHeader>
              <CardContent className="!pt-0">
                <div className="space-y-3 border-t border-gray-100 pt-3">
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

      <KYCDocumentPreviewModal
        open={documentPreviewOpen}
        onOpenChange={setDocumentPreviewOpen}
        document={selectedDocument}
        onStatusChange={handleDocumentStatusChange}
        onNavigate={navigateDocument}
        currentIndex={activeDocumentIndex}
        totalDocuments={myDocument.length}
      />
    </>
  );
}
