import { useState } from "react";
import { 
  FileText,
  UserCheck,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriverApplicationStatusModal } from "@/components/modal/DriverApplicationStatusModal";
import { KYCRequestStatusModal } from "@/components/modal/KYCRequestStatusModal";
import { useToast } from "@/hook/use-toast";
import { 
  mockDriverApplications, 
  mockKYCRequests, 
  type DriverApplication,
  type KYCRequest
} from "@/data/mockKYC";
import DriverApplications from "./DriverApplications";
import Request from "./Request";

export default function KYC() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  
  // Pagination state
  const [appPage, setAppPage] = useState(1);
  const [kycPage, setKycPage] = useState(1);
  const pageSize = 5;

  // Modal
  const [appStatusModalOpen, setAppStatusModalOpen] = useState(false);
  const [kycStatusModalOpen, setKycStatusModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [selectedKYCRequest, setSelectedKYCRequest] = useState<KYCRequest | null>(null);

  // Filtre driver application
  const filteredApplications = mockDriverApplications.filter(
    (app) =>
      app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter demandes KYC
  const filteredKYCRequests = mockKYCRequests.filter(
    (req) =>
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const appStats = {
    total: mockDriverApplications.length,
    pending: mockDriverApplications.filter(a => a.status === "PENDING").length,
    approved: mockDriverApplications.filter(a => a.status === "APPROVED").length,
    rejected: mockDriverApplications.filter(a => a.status === "REJECTED").length,
  };

  const kycStats = {
    total: mockKYCRequests.length,
    pending: mockKYCRequests.filter(r => r.status === "PENDING").length,
    approved: mockKYCRequests.filter(r => r.status === "APPROVED").length,
    rejected: mockKYCRequests.filter(r => r.status === "REJECTED").length,
  };


  const handleAppStatusSubmit = (data: { status: "APPROVED" | "REJECTED"; reason: string }) => {
    toast({
      title: data.status === "APPROVED" ? "Candidature approuvée" : "Candidature rejetée",
      description: `La candidature de ${selectedApplication?.userName} a été mise à jour.`,
    });
}
  const handleKYCStatusSubmit = (data: { status: "APPROVED" | "REJECTED"; reason: string }) => {
    toast({
      title: data.status === "APPROVED" ? "Demande validée" : "Demande rejetée",
      description: `La demande KYC de ${selectedKYCRequest?.userName} a été mise à jour.`,
    });
  };

  

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
              <FileText className="w-4 h-4 mr-2" />
              Demandes KYC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <DriverApplications 
                appStats={appStats}
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
                page={kycPage}
                pageSize={pageSize}
                paginatedKYCRequests={paginatedKYCRequests}
                searchQuery={searchQuery}
                setKycStatusModalOpen={setKycStatusModalOpen}
                setPage={setKycPage}
                setSearchQuery={setSearchQuery}
                setSelectedKYCRequest={setSelectedKYCRequest}
                totalPages={totalKYCPages}
            />
          </TabsContent>
        </Tabs>
      </div>

      {selectedApplication && (
        <DriverApplicationStatusModal
          open={appStatusModalOpen}
          onOpenChange={setAppStatusModalOpen}
          applicationId={selectedApplication.id}
          currentStatus={selectedApplication.status}
          onSubmit={handleAppStatusSubmit}
        />
      )}

      {selectedKYCRequest && (
        <KYCRequestStatusModal
          open={kycStatusModalOpen}
          onOpenChange={setKycStatusModalOpen}
          requestId={selectedKYCRequest.id}
          currentStatus={selectedKYCRequest.status}
          onSubmit={handleKYCStatusSubmit}
        />
      )}
    </>
  )
}
