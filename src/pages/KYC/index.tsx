import { useEffect, useState } from "react";
import { 
  FileText,
  Send,
  UserCheck,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriverApplicationStatusModal } from "@/components/modal/DriverApplicationStatusModal";
import { KYCRequestStatusModal } from "@/components/modal/KYCRequestStatusModal";
import { useToast } from "@/hook/use-toast";
import DriverApplications from "./DriverApplications";
import Request from "./Request";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { DriverApplication, getAllDriverApp, getAllKycRequest, KycRequest, updateDriverApp, updateKycRequest } from "@/store/slices/kyc.slice";
import LoaderUltra from "@/components/ui/loaderUltra";
import { GetAllUsers } from "@/store/slices/user.slice";
import Documents from "./Documents";
import { Document, getAllDocuments, updateDocument } from "@/store/slices/document.slice";
import { DocumentStatusModal } from "@/components/modal/DocumentStatusModal";

export default function KYC() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDoc, setSearchDoc] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { driverApplications,requests } = useAppSelector((state) => state.kyc);
  const { users } = useAppSelector((state) => state.users);
  const { documents } = useAppSelector((state) => state.document);

  useEffect(() => {
      const fetchData = async () => {
        const start = performance.now();
        await Promise.all([
          dispatch(getAllDriverApp()),
          dispatch(getAllKycRequest()),
          dispatch(GetAllUsers()),
          dispatch(getAllDocuments())
        ]);
        const end = performance.now();
        const elapsed = end - start;
        setDuration(elapsed);
        setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
      };
      fetchData();
    }, [dispatch]);

  // Pagination state
  const [appPage, setAppPage] = useState(1);
  const [kycPage, setKycPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const pageSize = 5;

  // Modal
  const [appStatusModalOpen, setAppStatusModalOpen] = useState(false);
  const [kycStatusModalOpen, setKycStatusModalOpen] = useState(false);
  const [docStatusModalOpen, setDocStatusModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [selectedKYCRequest, setSelectedKYCRequest] = useState<KycRequest | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [appFilter, setAppFilter] = useState('all');
  const [requestFilter, setRequestFilter] = useState('all');
  const [documentFilter, setDocumentFilter] = useState('all');

  // Filtre driver application
  const filteredApplications = driverApplications.filter(
    (app) =>{
      const matchesSearch= app.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.emergencyContact.name?.toLowerCase().includes(searchQuery.toLowerCase())
     const matchesStatus = appFilter === "all" || app.status === appFilter;
      return matchesSearch && matchesStatus;
  });

  // Filtre pour demandes KYC
  const filteredKYCRequests = requests.filter(
    (req) =>{
      const matchesSearch= req.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.kycRequestId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reviewedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = requestFilter === "all" || req.status === requestFilter;
      return matchesSearch && matchesStatus;
  });

  // Filtre pour documents
  const filteredDocuments = documents.filter(
    (req) =>{
      const matchesSearch= req.owner?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.documentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vehicleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) 
      const matchesStatus = documentFilter === "all" || req.state === documentFilter;
      return matchesSearch && matchesStatus;
  });

  // Pagination pour driver application
  const totalAppPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApplications = filteredApplications.slice(
    (appPage - 1) * pageSize,
    appPage * pageSize
  );

  // Pagination pour demande KYC
  const totalKYCPages = Math.ceil(filteredKYCRequests.length / pageSize);
  const paginatedKYCRequests = filteredKYCRequests.slice(
    (kycPage - 1) * pageSize,
    kycPage * pageSize
  );

  // Pagination pour document
  const totalDocumentPages = Math.ceil(filteredDocuments.length / 20);
  const paginatedDocuments = filteredDocuments.slice(
    (kycPage - 1) * 20,
    kycPage * 20
  );

  const appStats = {
    total: driverApplications.length,
    pending: driverApplications.filter(a => a.status === "PENDING").length,
    approved: driverApplications.filter(a => a.status === "APPROVED").length,
    rejected: driverApplications.filter(a => a.status === "REJECTED").length,
    under_review: driverApplications.filter(a => a.status === "UNDER_REVIEW").length,
  };

  const kycStats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "PENDING").length,
    approved: requests.filter(r => r.status === "APPROVED").length,
    rejected: requests.filter(r => r.status === "REJECTED").length,
    // expired: requests.filter(r => r.status === "EXPIRED").length,
  };
  const documetStats = {
    total: documents.length,
    pending: documents.filter(a => a.state === "PENDING").length,
    approved: documents.filter(a => a.state === "APPROVED").length,
    rejected: documents.filter(a => a.state === "REJECTED").length,
    expired: documents.filter(r => r.state === "EXPIRED").length,
  };

  const statusTitleMap: Record<string, string> = {
    APPROVED: "Document approuvé",
    REJECTED: "Document rejeté",
    EXPIRED: "Document expiré",
  };

  const handleAppStatusSubmit = async(datas: { status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; reason: string }) => {
        setAppLoading(true);
        try {
          const id=selectedApplication.applicationId
          const data={id,datas}
          await dispatch(updateDriverApp(data)).unwrap();
          setAppStatusModalOpen(false)
          toast({
            title: statusTitleMap[datas.status] ?? "Statut inconnu",
            description: `La candidature de ${selectedApplication?.licenseNumber} a été mise à jour.`,
          });
        } catch (error) {
          toast({
            description: error?.toString(),
            variant: "destructive",
          });
        } finally {
          setAppLoading(false);
        }
  }
  const handleKYCStatusSubmit = async(data: { status: "APPROVED" | "REJECTED"; rejectionReasons: string[]; }) => {
      // setKycLoading(true);
      //   try {
      //     const datas={
      //       id:selectedKYCRequest.kycRequestId,
      //       datas:data
      //     }
      //     await dispatch(updateKycRequest(datas)).unwrap();
      //     setAppStatusModalOpen(false)
      //     toast({
      //       title: data.status === "APPROVED" ? "Demande validée" : "Demande rejetée",
      //       description: `La demande KYC de ${selectedKYCRequest?.user.displayName} a été mise à jour.`,
      //     });
      //   } catch (error) {
      //     toast({
      //       description: error?.toString(),
      //       variant: "destructive",
      //     });
      //   } finally {
      //     setKycLoading(false);
      //   }
  };

  const handleUpdateDocumentStatus = async(datas: { state: string; reviewNote: string }) => {
        setDocLoading(true);
        try {
          const id=selectedDocument.documentId
          const data={id,datas}
          await dispatch(updateDocument(data)).unwrap();
          setDocStatusModalOpen(false)
          toast({
            title: statusTitleMap[datas.state] ?? "Statut inconnu",
            description: `Le statut du document ${selectedDocument?.fileName} a été mise à jour.`,
          });
        } catch (error) {
          toast({
            description: error?.toString(),
            variant: "destructive",
          });
        } finally {
          setDocLoading(false);
        }
  }

   if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

  return (
    <>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="applications" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-foreground">
              <UserCheck className="w-4 h-4 mr-2" />
              Candidatures Chauffeurs
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-foreground">
              <Send className="w-4 h-4 mr-2" />
              Demandes KYC
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <DriverApplications 
                appStats={appStats}
                statusFilter={appFilter}
                setStatusFilter={setAppFilter}
                paginatedApplications={paginatedApplications}
                searchQuery={searchQuery}
                setAppStatusModalOpen={setAppStatusModalOpen}
                setSearchQuery={setSearchQuery}
                setSelectedApplication={setSelectedApplication}
                page={appPage}
                pageSize={pageSize}
                totalPages={totalAppPages}
                setPage={setAppPage}
            />
          </TabsContent>
          <TabsContent value="requests" className="space-y-4">
            <Request
                kycStats={kycStats}
                users={users}
                page={kycPage}
                pageSize={pageSize}
                statusFilter={requestFilter}
                setStatusFilter={setRequestFilter}
                paginatedKYCRequests={paginatedKYCRequests}
                searchQuery={searchQuery}
                setKycStatusModalOpen={setKycStatusModalOpen}
                setPage={setKycPage}
                setSearchQuery={setSearchQuery}
                setSelectedKYCRequest={setSelectedKYCRequest}
                totalPages={totalKYCPages}
            />
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            <Documents
                documentStats={documetStats}
                page={docPage}
                pageSize={pageSize}
                statusFilter={documentFilter}
                setStatusFilter={setDocumentFilter}
                paginatedData={paginatedDocuments}
                searchQuery={searchDoc}
                setStatusModalOpen={setDocStatusModalOpen}
                setPage={setDocPage}
                setSearchQuery={setSearchDoc}
                setSelected={setSelectedDocument}
                totalPages={totalDocumentPages}
            />
          </TabsContent>
        </Tabs>
      </div>

      {selectedApplication && (
        <DriverApplicationStatusModal
          open={appStatusModalOpen}
          appLoading={appLoading}
          onOpenChange={setAppStatusModalOpen}
          applicationId={selectedApplication.applicationId}
          currentStatus={selectedApplication.status}
          onSubmit={handleAppStatusSubmit}
        />
      )}

      {selectedKYCRequest && (
        <KYCRequestStatusModal
          open={kycStatusModalOpen}
          onOpenChange={setKycStatusModalOpen}
          requestId={selectedKYCRequest.kycRequestId}
          currentStatus={selectedKYCRequest.status}
          // onSubmit={handleKYCStatusSubmit}
        />
      )}

      {selectedDocument && (
        <DocumentStatusModal
          appLoading={docLoading}
          open={docStatusModalOpen}
          onOpenChange={setDocStatusModalOpen}
          documentId={selectedDocument.documentId}
          // currentStatus={selectedDocument.state}
          onSubmit={handleUpdateDocumentStatus}
        />
      )}
    </>
  )
}
