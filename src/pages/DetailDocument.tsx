import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
 Calendar, Clock, AlertCircle, CheckCircle, XCircle, 
  FileText, Eye, ZoomIn, ZoomOut, RotateCw, Download, Shield, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailCard, InfoRow } from "@/components/DetailCard";
import { DocumentPreviewModal, } from "@/components/modal/DocumentPreviewModal";
import { useToast } from "@/hook/use-toast";
import { kycStatusConfig, documentTypeConfig } from "@/data/mockKYC";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getAllDocuments } from "@/store/slices/document.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { DocumentStatusModal } from "@/components/modal/DocumentStatusModal";


export default function DetailDocument() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch=useAppDispatch()
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const { documents } = useAppSelector((state) => state.document);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

   useEffect(() => {
        const fetchData = async () => {
          const start = performance.now();
          await Promise.all([
            dispatch(getAllDocuments())
          ]);
          const end = performance.now();
          const elapsed = end - start;
          setDuration(elapsed);
          setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
        };
        fetchData();
      }, [dispatch]);

const docs = documents.find(r => r.documentId === docId);
  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;
  console.log('docs0',docs)

  const formatDate = (dateString: string) => {
    try { return format(new Date(dateString), "dd MMM yyyy à HH:mm", { locale: fr }); } 
    catch { return dateString; }
  };

  const handleStatusSubmit = (data: { state: string; reviewNote: string }) => {
    toast({
      title: data.state === "APPROVED" ? "Document validé" : "Document rejeté",
      description: `Le statut du document ${docs.fileName} de l'utilisateur ${docs.owner.displayName} a été mise à jour.`,
    });
  };

  const StatusIcon = docs.state === "APPROVED" ? CheckCircle : 
                     docs.state === "REJECTED" ? XCircle : Clock;

  if (!docs) {
    return (
      <>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Demande non trouvée</h2>
            <Button variant="outline" onClick={() => navigate("/kyc")}>Retour</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Document Preview */}
              <div className="lg:col-span-2">
                <DetailCard title="Aperçu du document" icon={<Eye className="w-4 h-4 text-primary" />}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{documentTypeConfig[docs.type]?.label}</p>
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.max(prev - 25, 50))} className="h-8 w-8">
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium px-2 min-w-[40px] text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setZoom(prev => Math.min(prev + 25, 200))} className="h-8 w-8">
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setRotation(prev => (prev + 90) % 360)} className="h-8 w-8">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-xl min-h-[400px] flex items-center justify-center overflow-hidden border border-border/50">
                      {docs.url ? (
                        <div className="relative cursor-pointer group" onClick={() => setDocumentPreviewOpen(true)}>
                            <iframe src={docs.url} ></iframe>
                          <img 
                            src={docs.url} 
                            alt={docs.fileName}
                            className="max-w-full max-h-[380px] object-contain rounded-lg transition-transform duration-200"
                            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
                          />
                          <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-card px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2">
                              <Eye className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Agrandir</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-muted-foreground">Document non disponible</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Soumis le {formatDate(docs.createdAt)}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Télécharger</Button>
                      </div>
                    </div>
                  </div>
                </DetailCard>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <DetailCard title="Informations" icon={<Shield className="w-4 h-4 text-primary" />}>
                  <div className="space-y-3">
                    <InfoRow label="Type de document" value={
                      <Badge variant="outline" className={documentTypeConfig[docs.type]?.className}>
                        {documentTypeConfig[docs.type]?.label}
                      </Badge>
                    } />
                    <InfoRow label="Numéro" className="text-xs" value={docs.documentId} icon={<Hash className="w-3 h-3 text-muted-foreground" />} />
                    <InfoRow label="Statut" value={
                      <Badge variant="outline" className={kycStatusConfig[docs.state]?.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {kycStatusConfig[docs.state]?.label}
                      </Badge>
                    } />
                  </div>
                </DetailCard>

                {/* {docs.state === "REJECTED" && docs.rejectionReason && (
                  <DetailCard title="Raison du rejet" icon={<AlertCircle className="w-4 h-4 text-destructive" />} variant="danger">
                    <p className="text-sm text-foreground">{request.rejectionReason}</p>
                  </DetailCard>
                )} */}

                {docs.state === "PENDING" && (
                  <DetailCard title="Actions" icon={<CheckCircle className="w-4 h-4 text-primary" />}>
                    <div className="space-y-2">
                      <Button className="w-full bg-success hover:bg-success/90 text-white" onClick={() => setStatusModalOpen(true)}>
                        <CheckCircle className="w-4 h-4 mr-2" />Approuver
                      </Button>
                      <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10" onClick={() => setStatusModalOpen(true)}>
                        <XCircle className="w-4 h-4 mr-2" />Rejeter
                      </Button>
                    </div>
                  </DetailCard>
                )}
              </div>
            </div>
      </div>


    <DocumentStatusModal
              appLoading={loading}
              open={statusModalOpen}
              onOpenChange={setStatusModalOpen}
              documentId={docs.documentId}
              // currentStatus={selectedDocument.state}
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
