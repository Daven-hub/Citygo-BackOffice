import { MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const destinations = [
  { city: "Douala", rides: 280, percentage: 100 },
  { city: "Yaounde", rides: 192, percentage: 68 },
  { city: "Bertoua", rides: 165, percentage: 58 },
  { city: "Kribi", rides: 142, percentage: 50 },
  { city: "Bafang", rides: 118, percentage: 42 },
];

export function TopDestinations() {
  return (
    <div className="rounded-[6px] border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Destinations populaires</h3>
        {/* <p className="text-sm text-muted-foreground mt-1">Les villes les plus demandées</p> */}
      </div>
      
      <div className="space-y-6">
        {destinations.map((dest, index) => (
          <div key={dest.city} className="space-y-2">
            <div className="flex text-md items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{dest.city}</span>
              </div>
              <span className="text-sm text-muted-foreground">{dest.rides} trajets</span>
            </div>
            <Progress 
              color="rgba(30,58,138,0.35)"
              value={dest.percentage} 
              className="h-2 bg-[rgba(30,58,138,0.05)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
