import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Car,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Ban,
  Armchair,
  Palette,
  Image as ImageIcon,
  Shield,
  ClipboardCheck,
  File,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  MapPin,
  Star,
  Phone,
  Mail,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VehicleStatusModal } from "@/components/modal/VehicleStatusModal";
import { DocumentPreviewModal } from "@/components/modal/DocumentPreviewModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hook/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getvehicleById } from "@/store/slices/vehicles.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { Document, getAllDocuments, updateDocument } from "@/store/slices/document.slice";
import { documentTypeConfig } from "@/data/mockKYC";
import { comfortLevelConfig, vehicleStatusConfig } from "@/data/mockVehicles";
import { KYCDocumentPreviewModal } from "@/components/modal/KYCDocumentPreviewModal";

const documentIcons = {
  INSURANCE: Shield,
  REGISTRATION: FileText,
  INSPECTION: ClipboardCheck,
  OTHER: File,
};

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { vehiclesId } = useAppSelector((state) => state.vehicle);
  const { documents } = useAppSelector((state) => state.document);
  const { toast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const [docLoading,setDocLoading]=useState(false)
  const [showRejectForm,setShowRejectForm]=useState(false)
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  const imagInclude = ['VEHICLE_PHOTO_INTERIOR', 'VEHICLE_PHOTO_BACK', 'VEHICLE_PHOTO_FRONT', 'VEHICLE_PHOTO_PLATE']

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(getvehicleById(vehicleId)),
        dispatch(getAllDocuments({ page: 0, size: 20, category: 'VEHICLE', vehicleId: vehicleId }))
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, vehicleId])

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  const vehicle = vehiclesId;

  // console.log('documentss', documents)
  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Car className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-4">Véhicule non trouvé</p>
        <Button onClick={() => navigate("/vehicules")} variant="outline">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const images = documents.filter((doc) => imagInclude.includes(doc.type)) || [];
  const documentss = documents.filter((doc) => !imagInclude.includes(doc.type)) || [];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDocumentClick = (doc: Document,index:number) => {
    setSelectedDocument(doc);
    setActiveDocumentIndex(index);
    setDocumentPreviewOpen(true);
  };

  const pendingDocs = documentss.filter((d) => d.state === "PENDING").length;
  const approvedDocs = documentss.filter((d) => d.state === "APPROVED").length;
  const rejectedDocs = documentss.filter((d) => d.state === "REJECTED").length;
  const progressPercent = documentss.length > 0 ? (approvedDocs / documents.length) * 100 : 0;

  const getStatusActions = () => {
    const actions = [];
    if (vehicle.status !== "APPROVED") {
      actions.push({ label: "Approuver", icon: CheckCircle, variant: "succes" as const, status: "APPROVED" });
    }
    if (vehicle.status !== "SUSPENDED" && vehicle.status !== "REJECTED") {
      actions.push({ label: "Suspendre", icon: Ban, variant: "error" as const, status: "SUSPENDED" });
    }
    if (vehicle.status !== "REJECTED") {
      actions.push({ label: "Rejeter", icon: XCircle, variant: "destructive" as const, status: "REJECTED" });
    }
    return actions;
  };

  const handleDocumentStatusChange = async (datas: { state: string; reviewNote: string }) => {
      setDocLoading(true);
      try {
        const id = selectedDocument.documentId
        const data = { id, datas }
        await dispatch(updateDocument(data)).unwrap();
        dispatch(getAllDocuments({vehicleId:vehicleId}))
        setStatusModalOpen(false)
        setDocumentPreviewOpen(false)
        toast({
          title: datas.state === "APPROVED" ? "Document validé" : "Document rejeté",
          description: `Le document a été ${datas.state === "APPROVED" ? "approuvé" : "rejeté"}.`,
        });
      } catch (error) {
        toast({
          description: error?.toString(),
          variant: "destructive",
        });
      } finally {
        setDocLoading(false);
        setShowRejectForm(false)
      }
    };

    const navigateDocument = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? Math.max(0, activeDocumentIndex - 1)
      : Math.min(documentss.length - 1, activeDocumentIndex + 1);
    setActiveDocumentIndex(newIndex);
    setSelectedDocument(documentss[newIndex]);
  };

  return (
    <>
      <div className="min-h-screen space-y-4">
        {/* Sticky Header */}
        <div className="w-full border-b border-border/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/vehicules")}
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      {vehicle.make} {vehicle.model}
                    </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground font-mono">{vehicle.plate}</p>
                    <Badge
                        variant="outline"
                        className={cn("text-xs", vehicleStatusConfig[vehicle.status]?.className)}
                      >
                      {vehicleStatusConfig[vehicle.status]?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusActions().slice(0, 2).map((action) => (
                  <Button
                    key={action.status}
                    variant={action.variant}
                    size="sm"
                    onClick={() => setStatusModalOpen(true)}
                    className="gap-2"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-[6px] overflow-hidden bg-card border border-border/50">
                {images.length > 0 ? (
                  <div className="relative">
                    {images[selectedImageIndex]?.mimeType !== 'application/pdf' ?
                      <div className="aspect-[16/9] bg-muted overflow-hidden">
                        <img
                          src={images[selectedImageIndex]?.url}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      </div> :
                      <embed src={images[selectedImageIndex]?.url} type={images[selectedImageIndex]?.mimeType}
                        className="w-full h-[600px] object-cover transition-transform duration-500"
                      />}

                    {images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-muted flex flex-col items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Aucune image disponible</p>
                  </div>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto bg-muted/30">
                    {images.map((img, index) => (
                      <button
                        key={img.documentId}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                          selectedImageIndex === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Palette, label: "Couleur", value: vehicle.color, color: "bg-primary/10 text-primary" },
                  { icon: Armchair, label: "Places", value: `${vehicle.seats} places`, color: "bg-success/10 text-success" },
                  { icon: Car, label: "Type", value: vehicle.vehicleTypeName, color: "bg-warning/10 text-warning" },
                  { icon: Star, label: "Confort", value: comfortLevelConfig[vehicle.comfortLevel]?.label, color: "bg-purple-500/10 text-purple-500" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 space-y-1.5 relative rounded-[6px] bg-card border border-border/50 hover:border-border transition-colors"
                  >
                    <div className={cn("w-10 absolute top-1/2 -translate-y-1/2 right-4 h-10 rounded-lg flex items-center justify-center mb-3", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-[.9rem] text-foreground">{item.value?item.value:'N/A'}</p>
                  </div>
                ))}
              </div>

              {/* Documents Section */}
              <div className="rounded-[6px] bg-card border border-border/50 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Documents</h2>
                      <p className="text-sm text-muted-foreground">
                        {approvedDocs} sur {documentss.length} validés
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-warning" />
                          {pendingDocs} en attente
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-success" />
                          {approvedDocs} validés
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-destructive" />
                          {rejectedDocs} rejetés
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                </div>

                <div className="divide-y divide-border/50">
                  {documentss.map((doc,index) => {
                    const Icon = documentIcons[doc.type as keyof typeof documentIcons] || File;
                    const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                    return (
                      <div
                        key={doc.documentId}
                        onClick={() => handleDocumentClick(doc,index)}
                        className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors cursor-pointer group"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                            doc.state === "APPROVED" ? "bg-success/10" :
                              doc.state === "REJECTED" ? "bg-destructive/10" : "bg-warning/10"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6",
                              doc.state === "APPROVED" ? "text-success" :
                                doc.state === "REJECTED" ? "text-destructive" : "text-warning"
                            )}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-sm text-foreground truncate">{doc.type}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <p className="font-medium text-gray-400 truncate">{doc.fileName}</p>
                              {isExpired && (
                                <span className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertTriangle className="w-3 h-3" />
                                  Expiré
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {documentTypeConfig[doc.type]?.label}
                            {doc.expiryDate && !isExpired && (
                              <span> • Expire le {formatDate(doc.expiryDate)}</span>
                            )}
                          </p>
                        </div>

                        <Badge
                            variant="outline"
                            className={cn("text-[.6rem]",
                              doc.state === "APPROVED" && "text-success border-success/40",
                              doc.state === "REJECTED" && "text-destructive border-destructive/40",
                              doc.state === "PENDING" && "text-warning border-warning/40"
                            )}
                          >
                            {doc.state}
                          </Badge>
                      </div>
                    );
                  })}

                  {documents.length === 0 && (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">Aucun document</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-[6px] bg-card border border-border/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Propriétaire
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-lg font-semibold">
                      {vehicle.owner.displayName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{vehicle.owner.displayName}</h4>
                      <p className="text-sm text-muted-foreground">Conducteur vérifié</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">+221 77 123 45 67</span>
                    </div> */}
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {vehicle.owner.displayName.toLowerCase().replace(" ", ".")}@email.com
                      </span>
                    </div>
                    {/* <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Dakar, Sénégal</span>
                    </div> */}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 gap-2"
                    onClick={() => navigate(`/utilisateurs/${vehicle.owner.userId}`)}
                  >
                    Voir le profil complet
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Vehicle Summary */}
              <div className="rounded-[6px] bg-card border border-border/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Résumé
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3.5">
                  {[
                    { label: "Immatriculation", value: vehicle.plate },
                    { label: "Images", value: `${images.length} photo${images.length > 1 ? "s" : ""}` },
                    { label: "Documents", value: `${approvedDocs}/${documentss.length} validés` },
                    { label: "Niveau de confort", value: vehicle.comfortLevel ? comfortLevelConfig[vehicle.comfortLevel]?.label : 'N/A' },
                    { label: "Statut", value: vehicleStatusConfig[vehicle.status]?.label },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-[6px] bg-card border border-border/50 px-6 py-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-2">
                  {getStatusActions().map((action) => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      onClick={() => setStatusModalOpen(true)}
                      className="w-full gap-2"
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label} le véhicule
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VehicleStatusModal
        vehicle={vehicle}
        open={statusModalOpen}
        onOpenChange={(open) => {
          setStatusModalOpen(open);
          if (!open) {
            toast({
              title: "Statut mis à jour",
              description: "Le statut du véhicule a été modifié avec succès.",
            });
          }
        }}
      />

      <KYCDocumentPreviewModal
              open={documentPreviewOpen}
              loading={docLoading}
              showRejectForm={showRejectForm}
              setShowRejectForm={setShowRejectForm}
              onOpenChange={setDocumentPreviewOpen}
              document={selectedDocument}
              onStatusChange={handleDocumentStatusChange}
              onNavigate={navigateDocument}
              currentIndex={activeDocumentIndex}
              totalDocuments={documentss.length}
            />
    </>
  );
}
