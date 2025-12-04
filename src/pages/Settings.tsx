import { useState } from "react";
import { Save, Bell, Shield, Globe, Palette, Mail, User, Key, Database, CreditCard, Smartphone, Lock, Eye, EyeOff, Upload, Camera } from "lucide-react";
import { AdminLayout } from "@/components/header/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useToast } from "@/hook/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>("");
  
  const [settings, setSettings] = useState({
    siteName: "Citygo",
    siteDescription: "Plateforme de covoiturage moderne",
    supportEmail: "support@citygo.com",
    supportPhone: "+237 67888888",
    maxPassengers: "4",
    commissionRate: "15",
    currency: "FCFA",
    timezone: "Afrique/Cameroun",
    language: "fr",

    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    newUserNotif: true,
    newRideNotif: true,
    paymentNotif: true,
    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: "",
    maintenanceMode: false,
    // Profile
    adminName: "Admin Principal",
    adminEmail: "admin@citygo.com",
    adminRole: "Super Admin",
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  const handleConfirmAction = (action: string) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const executeAction = () => {
    if (confirmAction === "2fa") {
      setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth });
      toast({
        title: settings.twoFactorAuth ? "2FA désactivé" : "2FA activé",
        description: settings.twoFactorAuth 
          ? "L'authentification à deux facteurs a été désactivée."
          : "L'authentification à deux facteurs a été activée.",
      });
    } else if (confirmAction === "maintenance") {
      setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode });
      toast({
        title: settings.maintenanceMode ? "Mode maintenance désactivé" : "Mode maintenance activé",
        description: settings.maintenanceMode
          ? "Le site est maintenant accessible au public."
          : "Le site est maintenant en mode maintenance.",
      });
    }
    setConfirmOpen(false);
  };

  return (
    <>
      {/* <AdminHeader
        title="Paramètres"
        subtitle="Configurez les paramètres de la plateforme"
      /> */}

      <div className="w-full">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted/80 p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-background gap-2">
              <Globe className="w-4 h-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-background gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-background gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-background gap-2">
              <CreditCard className="w-4 h-4" />
              Paiements
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Configuration générale</h3>
                  <p className="text-sm text-muted-foreground">Paramètres de base de la plateforme</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de support</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Téléphone de support</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Afrique/Cameroun">Afrique/Cameroun</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="FCFA">FCFA</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar ($)</SelectItem>
                      <SelectItem value="GBP">Livre (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="siteDescription">Description du site</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="bg-background border-border resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Paramètres métier</h3>
                  <p className="text-sm text-muted-foreground">Configuration des règles de covoiturage</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxPassengers">Passagers max par trajet</Label>
                  <Input
                    id="maxPassengers"
                    type="number"
                    value={settings.maxPassengers}
                    onChange={(e) => setSettings({ ...settings, maxPassengers: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Profil administrateur</h3>
                  <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary/20 text-primary-foreground text-2xl font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="border-border">
                    <Camera className="w-4 h-4 mr-2" />
                    Changer la photo
                  </Button>
                </div>

                <div className="flex-1 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nom complet</Label>
                    <Input
                      id="adminName"
                      value={settings.adminName}
                      onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <Label>Rôle</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Badge className="gradient-primary text-primary-foreground">
                        {settings.adminRole}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Changer le mot de passe</h3>
                  <p className="text-sm text-muted-foreground">Mettez à jour votre mot de passe</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-background border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Canaux de notification</h3>
                  <p className="text-sm text-muted-foreground">Choisissez comment recevoir vos alertes</p>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { key: "emailNotifications", icon: Mail, label: "Notifications par email", description: "Recevoir les alertes par email" },
                  { key: "pushNotifications", icon: Bell, label: "Notifications push", description: "Recevoir les notifications en temps réel" },
                  { key: "smsNotifications", icon: Smartphone, label: "Notifications SMS", description: "Recevoir les alertes critiques par SMS" },
                  { key: "marketingEmails", icon: Mail, label: "Emails marketing", description: "Recevoir les newsletters et promotions" },
                ].map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                      />
                    </div>
                    {index < 3 && <Separator className="bg-border" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Types d'alertes</h3>
                  <p className="text-sm text-muted-foreground">Configurez les alertes que vous souhaitez recevoir</p>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { key: "newUserNotif", label: "Nouveaux utilisateurs", description: "Notification à chaque inscription" },
                  { key: "newRideNotif", label: "Nouveaux trajets", description: "Notification à chaque trajet publié" },
                  { key: "paymentNotif", label: "Paiements", description: "Notifications des transactions" },
                ].map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                      />
                    </div>
                    {index < 2 && <Separator className="bg-border" />}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Authentification</h3>
                  <p className="text-sm text-muted-foreground">Options de sécurité avancées</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Authentification à deux facteurs</p>
                      <p className="text-sm text-muted-foreground">Exiger 2FA pour les connexions admin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {settings.twoFactorAuth && (
                      <Badge className="bg-success/10 text-success border-success/20">Activé</Badge>
                    )}
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={() => handleConfirmAction("2fa")}
                    />
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">Mode maintenance</p>
                    <p className="text-sm text-muted-foreground">Désactiver l'accès public temporairement</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {settings.maintenanceMode && (
                      <Badge className="bg-warning/10 text-warning border-warning/20">Actif</Badge>
                    )}
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={() => handleConfirmAction("maintenance")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Politiques de sécurité</h3>
                  <p className="text-sm text-muted-foreground">Configurez les règles de sécurité</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Expiration de session (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiration mot de passe (jours)</Label>
                  <Input
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tentatives de connexion max</Label>
                  <Input
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => setSettings({ ...settings, loginAttempts: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Liste blanche IP</Label>
                  <Input
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payments Settings */}
          <TabsContent value="payments" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Configuration des paiements</h3>
                  <p className="text-sm text-muted-foreground">Gérez les options de paiement</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Clé API Stripe</Label>
                  <Input
                    type="password"
                    placeholder="sk_live_..."
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clé publique Stripe</Label>
                  <Input
                    type="password"
                    placeholder="pk_live_..."
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Délai de versement (jours)</Label>
                  <Input
                    type="number"
                    defaultValue="7"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Montant minimum de versement (€)</Label>
                  <Input
                    type="number"
                    defaultValue="10"
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          <Button onClick={handleSave} className="gradient-primary text-white hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder les modifications
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={executeAction}
        title={confirmAction === "2fa" 
          ? (settings.twoFactorAuth ? "Désactiver le 2FA ?" : "Activer le 2FA ?")
          : (settings.maintenanceMode ? "Désactiver le mode maintenance ?" : "Activer le mode maintenance ?")}
        description={confirmAction === "2fa"
          ? (settings.twoFactorAuth 
            ? "La désactivation du 2FA réduira la sécurité de votre compte."
            : "Vous devrez configurer une application d'authentification.")
          : (settings.maintenanceMode
            ? "Le site sera de nouveau accessible au public."
            : "Le site sera inaccessible pour les utilisateurs pendant la maintenance.")}
        variant={confirmAction === "maintenance" && !settings.maintenanceMode ? "warning" : "info"}
        confirmText={confirmAction === "2fa"
          ? (settings.twoFactorAuth ? "Désactiver" : "Activer")
          : (settings.maintenanceMode ? "Désactiver" : "Activer")}
      />
    </>
  );
}
