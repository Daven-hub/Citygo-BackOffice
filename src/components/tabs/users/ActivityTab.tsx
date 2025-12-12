import { Card, CardContent } from "@/components/ui/card";
import { Ban, CheckCircle, Clock, Lock, LogOut } from "lucide-react";

const actionStyles = {
  LOGIN: {
    border: "border-blue-500",
    badge: "bg-blue-100 text-blue-700",
    icon: <Lock className="w-4 h-4" />,
    dot: "bg-blue-500",
  },
  LOGOUT: {
    border: "border-primary/40",
    badge: "bg-primary/10 text-primary",
    icon: <LogOut className="w-4 h-4" />,
    dot: "bg-primary",
  },
  SUSPENDED: {
    border: "border-red-500",
    badge: "bg-red-100 text-red-700",
    icon: <Ban className="w-4 h-4" />,
    dot: "bg-red-500",
  },
  UNSUSPENDED: {
    border: "border-green-500",
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle className="w-4 h-4" />,
    dot: "bg-green-500",
  },
};

function ActivityTab({ userActivities }) {
  return (
    <div className="relative pl-10">
      {/* Timeline */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-muted" />

      <div className="space-y-8">
        {userActivities.map((log) => {
          const style = actionStyles[log.action];

          return (
            <div key={log.id} className="relative flex gap-6">
              
              {/* Timeline dot */}
              <div className="relative z-10 mt-5">
                <div className={`w-3 h-3 rounded-full ${style?.dot}`} />
              </div>

              {/* Card */}
              <Card
                className={`w-full border ${style?.border} shadow-sm hover:shadow-md transition`}
              >
                <CardContent className="p-4 space-y-3">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${style?.badge}`}>
                        {log.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex gap-3 items-start">
                    <div className="mt-0.5 text-muted-foreground">
                      {style?.icon}
                    </div>

                    <p className="text-sm text-foreground leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex gap-6 text-xs text-muted-foreground pt-2 border-t">
                    <span>🌍 {log.ipAddress}</span>
                    <span>🆔 {log.id.slice(0, 8)}…</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityTab
