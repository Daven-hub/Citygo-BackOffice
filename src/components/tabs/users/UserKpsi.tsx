import { Card, CardContent } from "@/components/ui/card";
import { Activity, Car, Star, Shield, CalendarClock, Route, BookCheck, BookX } from "lucide-react";

function Kpi({ icon: Icon, label, value, textColor , bgColor }) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50 dark:border-green-800/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserKpis() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Kpi icon={CalendarClock} textColor='text-blue-600' bgColor='bg-blue-500/20' label="Trajets planifiés" value="1" />
      <Kpi icon={Route} textColor='text-emerald-600' bgColor='bg-emerald-500/20' label="Trajets éffectués" value="2" />
      <Kpi icon={BookCheck} textColor='text-violet-600' bgColor='bg-violet-500/20' label="Resa. Confirmées" value="5" />
      <Kpi icon={BookX} textColor='text-rose-600' bgColor='bg-rose-500/20' label="Resa. Rejetées" value="2" />
    </div>
  );
}
