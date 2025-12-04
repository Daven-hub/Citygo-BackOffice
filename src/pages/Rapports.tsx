import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Car, 
  CreditCard, 
  MapPin,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw
} from "lucide-react";
// import { AdminLayout } from "@/layouts/AdminLayout";
// import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
// import { cn } from "@/lib/utils";
import { ReportDateFilter } from "@/components/ReportDateFilter";
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data
const revenueData = [
  { month: "Jan", revenue: 12500, commission: 1250, rides: 320 },
  { month: "Fév", revenue: 15800, commission: 1580, rides: 410 },
  { month: "Mar", revenue: 18200, commission: 1820, rides: 485 },
  { month: "Avr", revenue: 21500, commission: 2150, rides: 550 },
  { month: "Mai", revenue: 24800, commission: 2480, rides: 620 },
  { month: "Juin", revenue: 28900, commission: 2890, rides: 720 },
  { month: "Juil", revenue: 32500, commission: 3250, rides: 815 },
  { month: "Août", revenue: 35200, commission: 3520, rides: 880 },
  { month: "Sept", revenue: 31800, commission: 3180, rides: 795 },
  { month: "Oct", revenue: 29500, commission: 2950, rides: 735 },
  { month: "Nov", revenue: 27200, commission: 2720, rides: 680 },
  { month: "Déc", revenue: 31500, commission: 3150, rides: 790 },
];

const userGrowthData = [
  { month: "Jan", nouveaux: 85, actifs: 450 },
  { month: "Fév", nouveaux: 120, actifs: 520 },
  { month: "Mar", nouveaux: 145, actifs: 610 },
  { month: "Avr", nouveaux: 180, actifs: 720 },
  { month: "Mai", nouveaux: 210, actifs: 850 },
  { month: "Juin", nouveaux: 250, actifs: 980 },
];

const destinationData = [
  { name: "Paris", value: 35, color: "hsl(var(--primary))" },
  { name: "Lyon", value: 25, color: "hsl(var(--accent))" },
  { name: "Marseille", value: 20, color: "hsl(var(--success))" },
  { name: "Bordeaux", value: 12, color: "hsl(var(--warning))" },
  { name: "Autres", value: 8, color: "hsl(var(--muted))" },
];

const reportTypes = [
  { 
    id: "financial", 
    title: "Rapport Financier", 
    description: "Revenus, commissions et transactions",
    icon: CreditCard,
    lastGenerated: "02/12/2024"
  },
  { 
    id: "users", 
    title: "Rapport Utilisateurs", 
    description: "Croissance et engagement des utilisateurs",
    icon: Users,
    lastGenerated: "01/12/2024"
  },
  { 
    id: "rides", 
    title: "Rapport Trajets", 
    description: "Statistiques des trajets et réservations",
    icon: Car,
    lastGenerated: "30/11/2024"
  },
  { 
    id: "destinations", 
    title: "Rapport Destinations", 
    description: "Destinations populaires et tendances",
    icon: MapPin,
    lastGenerated: "28/11/2024"
  },
];

export default function Rapports() {
  const { toast } = useToast();
  const [period, setPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleDownload = (reportType: string) => {
    const dateRange = startDate && endDate 
      ? ` (${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")})`
      : "";
    toast({
      title: "Téléchargement en cours",
      description: `Le rapport ${reportType}${dateRange} est en cours de génération.`,
    });
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    const now = new Date();
    switch (value) {
      case "week":
        setStartDate(subDays(now, 7));
        setEndDate(now);
        break;
      case "month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "quarter":
        setStartDate(subMonths(now, 3));
        setEndDate(now);
        break;
      case "year":
        setStartDate(startOfYear(now));
        setEndDate(endOfYear(now));
        break;
    }
  };

  const handleRefresh = () => {
    toast({
      title: "Données actualisées",
      description: "Les rapports ont été mis à jour avec les dernières données.",
    });
  };

  return (
    <>
      {/* <AdminHeader
        title="Rapports"
        subtitle="Analysez les performances de la plateforme"
      /> */}

      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-2xl font-bold text-foreground">€309,400</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+18.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commissions</p>
                  <p className="text-2xl font-bold text-foreground">€30,940</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+18.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trajets réalisés</p>
                  <p className="text-2xl font-bold text-foreground">7,800</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-foreground">2,450</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+8.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <TabsList className="bg-muted/100">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="financial">Financier</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="exports">Exports</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 flex-wrap">
              <ReportDateFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              
              <Button variant="outline" size="icon" onClick={handleRefresh} className="border-border">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Period Display */}
          {startDate && endDate && (
            <div className="mb-4 p-3 rounded-lg bg-muted/80 border border-border/50">
              <p className="text-[.82rem] text-muted-foreground">
                Période sélectionnée : <span className="font-medium text-primary">{format(startDate, "dd MMMM yyyy", { locale: fr })}</span> au <span className="font-medium text-primary text-foreground">{format(endDate, "dd MMMM yyyy", { locale: fr })}</span>
              </p>
            </div>
          )}

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Revenus mensuels
                  </CardTitle>
                  <CardDescription>Évolution des revenus sur l'année</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#revenueGradient)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Destinations Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-accent" />
                    Répartition par destination
                  </CardTitle>
                  <CardDescription>Top destinations des trajets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={destinationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {destinationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Métriques de performance</CardTitle>
                <CardDescription>Indicateurs clés de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taux de conversion</span>
                      <span className="font-medium text-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satisfaction client</span>
                      <span className="font-medium text-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taux de rétention</span>
                      <span className="font-medium text-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Analyse financière détaillée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="commission" name="Commissions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Croissance des utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="nouveaux" name="Nouveaux" stroke="hsl(var(--primary))" fill="url(#newUsersGradient)" strokeWidth={2} />
                      <Area type="monotone" dataKey="actifs" name="Actifs" stroke="hsl(var(--accent))" fill="url(#activeUsersGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <Card key={report.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <report.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Dernier export: {report.lastGenerated}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border"
                        onClick={() => handleDownload(report.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Rapport personnalisé</CardTitle>
                <CardDescription>Générez un rapport sur mesure avec les données de votre choix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[200px] bg-background border-border">
                      <SelectValue placeholder="Type de données" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">Toutes les données</SelectItem>
                      <SelectItem value="financial">Financier</SelectItem>
                      <SelectItem value="users">Utilisateurs</SelectItem>
                      <SelectItem value="rides">Trajets</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="month">
                    <SelectTrigger className="w-full sm:w-[200px] bg-background border-border">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="quarter">Ce trimestre</SelectItem>
                      <SelectItem value="year">Cette année</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="w-full sm:w-[150px] bg-background border-border">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="gradient-primary text-primary-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    Générer le rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
