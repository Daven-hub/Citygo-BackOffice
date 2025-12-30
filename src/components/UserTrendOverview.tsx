import ReactECharts from "echarts-for-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Filter, TrendingUp } from "lucide-react";
import { TrendData } from "@/store/slices/user.slice";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  startOfWeek,
  isValid 
} from "date-fns";

interface Props {
  data: TrendData[];
  period: string;
  metric: string;
  setPeriod: (value: string) => void;
  setMetric: (value: string) => void;
  loading?: boolean;
  className?: string;
}

function formatTrendData(data, period) {
  const today = new Date();

  if (!data?.length) return [];

  switch (period) {
    /** 🔹 JOUR : uniquement aujourd’hui */
    case "DAY":
      return data.filter(d =>
        isSameDay(parseISO(d.date), today)
      );

    /** 🔹 SEMAINE : groupé par jour */
    case "WEEK": {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });

      return data
        .filter(d =>
          isSameWeek(parseISO(d.date), today, { weekStartsOn: 1 })
        )
        .map(d => ({
          ...d,
          date: format(parseISO(d.date), "EEEE dd", { locale: fr }),
        }));
    }

    /** 🔹 MOIS : tous les jours du mois */
    case "MONTH":
      return data.filter(d =>
        isSameMonth(parseISO(d.date), today)
      );

    /** 🔹 ANNÉE : regroupement par mois */
    case "YEAR": {
      const grouped: Record<string, TrendData> = {};

      data
        .filter(d => isSameYear(parseISO(d.date), today))
        .forEach(d => {
          const month = format(parseISO(d.date), "MMM", { locale: fr });

          if (!grouped[month]) {
            grouped[month] = {
              date: d.date,
              label: month,
              registrations: 0,
              activeUsers: 0,
              driverApplications: 0,
            };
          }

          grouped[month].registrations += d.registrations;
          grouped[month].activeUsers += d.activeUsers;
          grouped[month].driverApplications += d.driverApplications;
        });

      return Object.values(grouped);
    }

    default:
      return data;
  }
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

  const formattedData = formatTrendData(data, period);
  const safeData = formattedData;

  function getLabel(d: { date?: string; label?: string }) {
  if (d.label) return d.label;

  if (!d.date) return "";

  const parsed = parseISO(d.date);
  if (!isValid(parsed)) return "";

  return format(parsed, "dd MMM", { locale: fr });
}
  // const dates = safeData.map(d =>
  //   d.label ?? format(parseISO(d.date), "dd MMM", { locale: fr })
  // );
  const dates = safeData.map(d => getLabel(d));


  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15,23,42,0.9)",
      borderWidth: 0,
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#94a3b8",
          width: 1,
        },
      },
    },
    legend: {
      top: 16,
      icon: "circle",
      itemWidth: 10,
      textStyle: {
        color: "#94a3b8",
        fontSize: 12,
      },
    },
    grid: {
      top: 60,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLine: { lineStyle: { color: "#334155" } },
      axisLabel: { color: "#94a3b8" },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { color: "#94a3b8" },
      splitLine: {
        lineStyle: {
          color: "rgba(148,163,184,0.15)",
        },
      },
    },
    series: [
      buildSeries(
        "Utilisateurs actifs",
        safeData.map(d => d.activeUsers),
        "rgb(34,197,94)",
        metric !== "ACTIVE" && metric !== "ALL"
      ),
      buildSeries(
        "Inscriptions",
        safeData.map(d => d.registrations),
        "rgb(59,130,246)",
        metric !== "REGISTRATION" && metric !== "ALL"
      ),
      buildSeries(
        "Demandes conducteur",
        safeData.map(d => d.driverApplications),
        "rgb(245,158,11)",
        metric !== "DRIVER" && metric !== "ALL"
      ),
    ],
  };

  return (
    <div
      className={`relative rounded-[6px] border border-border/50 
      bg-gradient-to-br bg-white 
      px-5 pt-6 pb-1 shadow-sm backdrop-blur-md ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="mb-0.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Tendances utilisateurs
          </h3>
        </div>

        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 border-border bg-background/60">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
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
            <SelectTrigger className="h-9 border-border bg-background/60">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Métrique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes</SelectItem>
              <SelectItem value="REGISTRATION">Inscriptions</SelectItem>
              <SelectItem value="ACTIVE">Utilisateurs actifs</SelectItem>
              <SelectItem value="DRIVER">Candidatures conducteur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[330px]">
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
    symbol: "circle",
    symbolSize: 6,
    showSymbol: false,
    emphasis: { focus: "series" },
    data,
    show: !hidden,
    lineStyle: { width: 2.5, color },
    itemStyle: { color },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: color.replace("rgb", "rgba").replace(")", ",0.25)") },
          { offset: 1, color: color.replace("rgb", "rgba").replace(")", ",0)") },
        ],
      },
    },
  };
}
