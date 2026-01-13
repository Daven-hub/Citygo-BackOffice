import { useState, useMemo, useEffect } from "react";
import { 
  Save, 
  Search, 
  CalendarCheck, 
  MessageSquare, 
  UserCheck, 
  Car, 
  Settings,
  MapPin, 
  Wallet, 
  DollarSign, 
  Star, 
  Landmark, 
  Headphones,
  Edit2,
  Check,
  X,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockSystemSettings, SystemSetting } from "@/data/mockSettings";
import { useToast } from "@/hook/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllCategorie, getAllSettings } from "@/store/slices/settings.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import LoaderUltra from "@/components/ui/loaderUltra";

const categoryIcons: Record<string, React.ElementType> = {
  "Booking": CalendarCheck,
  "Chat": MessageSquare,
  "Check-in": UserCheck,
  "Driver": Car,
  "GPS": MapPin,
  "Payout": Wallet,
  "Pricing": DollarSign,
  "Rating": Star,
  "Settlement": Landmark,
  "Support": Headphones
};

const categoryColors: Record<string, string> = {
  "Booking": "bg-blue-500/10 text-blue-500",
  "Chat": "bg-purple-500/10 text-purple-500",
  "Check-in": "bg-green-500/10 text-green-500",
  "Driver": "bg-orange-500/10 text-orange-500",
  "GPS": "bg-red-500/10 text-red-500",
  "Payout": "bg-emerald-500/10 text-emerald-500",
  "Pricing": "bg-yellow-500/10 text-yellow-500",
  "Rating": "bg-amber-500/10 text-amber-500",
  "Settlement": "bg-indigo-500/10 text-indigo-500",
  "Support": "bg-cyan-500/10 text-cyan-500"
};

export default function SettingsPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { settingCateg,settings } = useAppSelector((state) => state.setting);

  useEffect(() => {
      const fetchData = async () => {
        const start = performance.now();
        await Promise.all([
          dispatch(getAllSettings()),
          dispatch(getAllCategorie())
        ]);
        const end = performance.now();
        const elapsed = end - start;
        setDuration(elapsed);
        setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
      };
      fetchData();
    }, [dispatch])

  // Group settings by category
  const settingsByCategory = useMemo(() => {
    const grouped: Record<string, SystemSetting[]> = {};
    settings.forEach((setting) => {
      if (!grouped[setting.category]) {
        grouped[setting.category] = [];
      }
      grouped[setting.category].push(setting);
    });
    return grouped;
  }, [settings]);

  console.log('settingsByCategory',settingsByCategory)

  const categories = Object.keys(settingsByCategory).sort();

  // Filter settings based on search and category
  const filteredSettings = useMemo(() => {
    let filtered = settings;

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.key.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.value.toLowerCase().includes(query)
      );
    }

    // Group by category
    const grouped: Record<string, SystemSetting[]> = {};
    filtered.forEach((setting) => {
      if (!grouped[setting.category]) {
        grouped[setting.category] = [];
      }
      grouped[setting.category].push(setting);
    });

    return grouped;
  }, [settings, searchQuery, selectedCategory]);

  if (isLoading) return <LoaderUltra loading={isLoading} duration={duration} />;

    console.log('settings',settings)

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setEditValue(setting.value);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingSetting) return;

    // setSettings((prev) =>
    //   prev.map((s) =>
    //     s.id === editingSetting.id
    //       ? { ...s, value: editValue, updatedAt: new Date().toISOString(), updatedBy: "Admin" }
    //       : s
    //   )
    // );

    toast({
      title: "Paramètre mis à jour",
      description: `${editingSetting.key} a été modifié avec succès.`,
    });

    setShowEditDialog(false);
    setEditingSetting(null);
  };

  const handleToggleBoolean = (setting: SystemSetting) => {
    const newValue = setting.value === "true" ? "false" : "true";
    // setSettings((prev) =>
    //   prev.map((s) =>
    //     s.id === setting.id
    //       ? { ...s, value: newValue, updatedAt: new Date().toISOString(), updatedBy: "Admin" }
    //       : s
    //   )
    // );

    toast({
      title: "Paramètre mis à jour",
      description: `${setting.key} a été ${newValue === "true" ? "activé" : "désactivé"}.`,
    });
  };

  const getKeyName = (key: string) => {
    // Get the part after the first dot and format it
    const parts = key.split(".");
    if (parts.length > 1) {
      return parts.slice(1).join(".").replace(/_/g, " ").replace(/\./g, " › ");
    }
    return key.replace(/_/g, " ");
  };

  const renderSettingValue = (setting: SystemSetting) => {
    if (setting.valueType === "BOOLEAN") {
      return (
        <Switch
          checked={setting.value === "true"}
          onCheckedChange={() => handleToggleBoolean(setting)}
        />
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-mono">
          {setting.value || "(vide)"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => handleEditSetting(setting)}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-64 shrink-0">
            <div className="rounded-xl border border-border bg-card p-4 sticky top-[80px]">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                Catégories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    !selectedCategory
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  <span>Tous</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {settings.length}
                  </Badge>
                </button>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category] || Settings;
                  const count = settingsByCategory[category]?.length || 0;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{category}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un paramètre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Settings Grid */}
            {Object.entries(filteredSettings).map(([category, categorySettings]) => {
              const IconComponent = categoryIcons[category] || Settings;
              const colorClass = categoryColors[category] || "bg-muted text-muted-foreground";

              return (
                <div key={category} className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
                  {/* Category Header */}
                  <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClass)}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {categorySettings.length} paramètre{categorySettings.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Settings List */}
                  <div className="divide-y divide-border">
                    {categorySettings.map((setting) => (
                      <div
                        key={setting.id}
                        className="px-6 py-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {setting.key}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {setting.valueType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {setting.description}
                            </p>
                            {setting.updatedBy && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>
                                  Modifié par {setting.updatedBy} le{" "}
                                  {format(new Date(setting.updatedAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="shrink-0">{renderSettingValue(setting)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {Object.keys(filteredSettings).length === 0 && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                {/* <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" /> */}
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun paramètre trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Modifier le paramètre</DialogTitle>
            <DialogDescription>
              {editingSetting?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Clé</Label>
              <code className="block text-sm font-mono bg-muted px-3 py-2 rounded-lg">
                {editingSetting?.key}
              </code>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editValue">Valeur ({editingSetting?.valueType})</Label>
              <Input
                id="editValue"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                type={editingSetting?.valueType === "INTEGER" ? "number" : "text"}
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} className="gradient-primary text-primary-foreground">
              <Check className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
  );
}
