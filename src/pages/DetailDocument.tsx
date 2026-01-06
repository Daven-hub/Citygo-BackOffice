import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Shield,
  Hash,
  ArrowLeft,
  MoveLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailCard, InfoRow } from "@/components/DetailCard";
import { DocumentPreviewModal } from "@/components/modal/DocumentPreviewModal";
import { useToast } from "@/hook/use-toast";
import { kycStatusConfig, documentTypeConfig } from "@/data/mockKYC";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getAllDocuments,
  previewDocument,
  updateDocument,
} from "@/store/slices/document.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { DocumentStatusModal } from "@/components/modal/DocumentStatusModal";

export default function DetailDocument() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const { documents, previewDoc } = useAppSelector((state) => state.document);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(getAllDocuments()),
        dispatch(previewDocument(docId)),
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, docId]);

  const docs = documents.find((r) => r.documentId === docId);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy à HH:mm", {
        locale: fr,
      });
    } catch {
      return dateString;
    }
  };
  const handleUpdateStatus=(x)=>{
      setCurrentStatus(x);
      setStatusModalOpen(true)
  }

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;
  if (!docs) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Demande non trouvée
            </h2>
            <Button variant="outline" onClick={() => navigate("/kyc")}>
              Retour
            </Button>
          </div>
        </div>
      </>
    );
  }

    const handleStatusSubmit = async(datas: { state: string; reviewNote: string }) => {
        console.log('datas',datas)
    // setDocLoading(true);
    //         try {
    //           const id=docId
    //           const data={id,datas}
    //           await dispatch(updateDocument(data)).unwrap();
    //           setStatusModalOpen(false)
    //           toast({
    //             title: datas.state === "APPROVED" ? "Document validé" : "Document rejeté",
    //             description:`Le statut du document ${docs.fileName} de l'utilisateur ${docs.owner.displayName} a été mise à jour.`,
    //           });
    //         } catch (error) {
    //           toast({
    //             description: error?.toString(),
    //             variant: "destructive",
    //           });
    //         } finally {
    //           setDocLoading(false);
    //         }
  };
  const StatusIcon =
    docs.state === "APPROVED"
      ? CheckCircle
      : docs.state === "REJECTED"
      ? XCircle
      : Clock;

  const urlWithoutQuery = docs.url.split("?")[0];
  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(urlWithoutQuery);

  return (
    <>
      <div className="space-y-2">
        <Button 
        variant="ghost" 
        onClick={() => navigate('/kyc')} 
        className="gap-2 w-fit bg-transparent border-transparent hover:text-secondary py-2 h-6 text-muted-foreground -ml-2"
      >
        <MoveLeft className="w-4 h-4" />
        Retour
      </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <DetailCard
              title="Aperçu du document"
              docs={docs}
              icon={<Eye className="w-4 h-4 text-primary" />}
            >
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-xl min-h-[400px] scrollbar-thin h-full w-full overflow-hidden border border-border/50 flex items-center justify-center">
                  {docs?.url ? (
                    <div className="relative w-full h-full cursor-pointer group">
                      {isImage ? (
                        <img
                          src={docs.url}
                          alt={docs.fileName}
                          className="w-full bg-black h-[450px] object-contain 
             transition-transform duration-300 
             group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : (
                        <embed
                          src={docs.url}
                          type={docs.mimeType}
                          className="w-full object-cover h-[450px] scrollbar-thin"
                        />
                      )}

                      {/* <div
                        className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 
                      transition-opacity flex items-center justify-center"
                      >
                        <div
                          className="bg-card px-5 py-2.5 rounded-full shadow-xl 
                        border border-border flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Agrandir</span>
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Document non disponible
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Soumis le {formatDate(docs.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    {/* <Button
                      onClick={() => setDocumentPreviewOpen(true)}
                      className="h-5 flex items-center gap-1"
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="max-md:hidden">Prévisualiser</span>
                    </Button> */}
                  </div>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <DetailCard
              title="Informations"
              icon={<Shield className="w-4 h-4 text-primary" />}
            >
              <div className="space-y-2.5">
                <InfoRow
                  label="Type de document"
                  value={
                    <Badge
                      variant="outline"
                      // className={documentTypeConfig[docs.type]?.className}
                    >
                      {/* {documentTypeConfig[docs.type]?.label} */}
                      {docs.type}
                    </Badge>
                  }
                />
                <InfoRow
                  label="Numéro"
                  className="text-xs"
                  value={docs.documentId}
                  icon={<Hash className="w-3 h-3 text-muted-foreground" />}
                />
                <InfoRow
                  label="Statut"
                  value={
                    <Badge
                      variant="outline"
                      className={kycStatusConfig[docs.state]?.className}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {kycStatusConfig[docs.state]?.label}
                    </Badge>
                  }
                />
              </div>
            </DetailCard>

            {/* {docs.state === "REJECTED" && docs.rejectionReason && (
                  <DetailCard title="Raison du rejet" icon={<AlertCircle className="w-4 h-4 text-destructive" />} variant="danger">
                    <p className="text-sm text-foreground">{request.rejectionReason}</p>
                  </DetailCard>
                )} */}

            {docs.state === "PENDING" && (
              <DetailCard
                title="Actions"
                icon={<CheckCircle className="w-4 h-4 text-primary" />}
              >
                <div className="space-y-2">
                  <Button
                    className="w-full bg-success hover:bg-success/90 text-white"
                    onClick={() => handleUpdateStatus('APPROVED')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-destructive text-white hover:bg-destructive/80"
                    onClick={() => handleUpdateStatus('REJECTED')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </DetailCard>
            )}
          </div>
        </div>
      </div>

      <DocumentStatusModal
        appLoading={docLoading}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        documentId={docs.documentId}
        currentStatus={currentStatus}
        onSubmit={handleStatusSubmit}
      />

      <DocumentPreviewModal
        open={documentPreviewOpen}
        onOpenChange={setDocumentPreviewOpen}
        document={docs}
        onStatusChange={() => {}}
      />
    </>
  );
}
