import ReactECharts from "echarts-for-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter } from "lucide-react";
import { TrendData } from "@/store/slices/user.slice";

interface Props {
  data: TrendData[];
  period: string;
  metric: string;
  setPeriod: (value: string) => void;
  setMetric: (value: string) => void;
  loading?: boolean;
  className?: string;
}

export function UserTrendOverview({
  data,
  period,
  metric,
  setPeriod,
  setMetric,
  loading = false,
  className,
}: Props) {

  const safeData = data?.length ? data : [];

  const dates = safeData.map(d =>
    format(parseISO(d.date), "dd MMM", { locale: fr })
  );

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 5,
      textStyle: { color: "#6b7280" },
    },
    grid: {
      top: 50,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      buildSeries("Utilisateurs actifs", safeData.map(d => d.activeUsers), "rgb(34,197,94)", metric !== "ACTIVE" && metric !== "ALL"),
      buildSeries("Inscriptions", safeData.map(d => d.registrations), "rgb(59,130,246)", metric !== "REGISTRATION" && metric !== "ALL"),
      buildSeries("Demandes conducteur", safeData.map(d => d.driverApplications), "rgb(245,158,11)", metric !== "DRIVER" && metric !== "ALL"),
    ],
  };

  return (
    <div className={`relative rounded-[6px] border border-border bg-card p-6 ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
          <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Tendances utilisateurs
        </h3>

        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="border-border">
              <Filter className="h-3 w-3 mr-1.5" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">Jour</SelectItem>
              <SelectItem value="WEEK">Semaine</SelectItem>
              <SelectItem value="MONTH">Mois</SelectItem>
              <SelectItem value="YEAR">Année</SelectItem>
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="border-border">
              <Filter className="h-4 w-4 mr-1.5" />
              <SelectValue placeholder="Métrique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous</SelectItem>
              <SelectItem value="REGIGISTRATIONS">Enregistrement</SelectItem>
              <SelectItem value="ACTIVE_USERS">Utilisateur Actif</SelectItem>
              <SelectItem value="DRIVER_APPLICATIONS">Candidature Conducteur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[290px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          notMerge
          lazyUpdate
        />
      </div>
    </div>
  );
}

function buildSeries(
  name: string,
  data: number[],
  color: string,
  hidden: boolean
) {
  return {
    name,
    type: "line",
    smooth: true,
    symbol: "none",
    data,
    show: !hidden,
    lineStyle: { width: 2, color },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: color.replace("rgb", "rgba").replace(")", ",0.3)") },
          { offset: 1, color: color.replace("rgb", "rgba").replace(")", ",0)") },
        ],
      },
    },
  };
}
