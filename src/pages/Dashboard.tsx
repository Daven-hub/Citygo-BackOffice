import LoaderUltra from "@/components/ui/loaderUltra";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import {
  Car,
  User,
  Star,
  DollarSign,
  ArrowDownToLine,
  CarFront,
  Calendar,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

  const cityTrips= [
    { name: "Douala", value: 230 },
    { name: "Yaoundé", value: 190 },
    { name: "Bafoussam", value: 95 },
    { name: "Garoua", value: 75 },
    { name: "Maroua", value: 65 },
    { name: "Bamenda", value: 120 },
    { name: "Ngaoundéré", value: 50 },
  ]

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  const sampleData = useMemo(
    () => ({
      summary: {
        ridesToday: 1248,
        activeDrivers: 312,
        avgRating: 4.82,
        revenueToday: 2890,
      },
      ridesByHour: Array.from({ length: 24 }).map((_, i) => ({
        hour: `${i}:00`,
        rides: Math.round(
          50 + 60 * Math.abs(Math.sin(i / 3)) + Math.random() * 25
        ),
      })),
      vehicleSplit: [
        { name: "Sedan", value: 420 },
        { name: "SUV", value: 280 },
        { name: "Van", value: 140 },
        { name: "Motorbike", value: 80 },
      ],
      topRoutes: [
        { route: "Centre → Littoral", count: 120 },
        { route: "Littoral → Centre", count: 98 },
        { route: "Littoral → Ouest", count: 76 },
        { route: "Nord → Sud", count: 60 },
      ],
      recentRides: Array.from({ length: 6 }).map((_, i) => ({
        id: `RIDE-${2100 + i}`,
        passenger: ["Alice", "Bob", "Camille", "David", "Elisa", "Farid"][
          i % 6
        ],
        driver: ["John", "Maria", "Olivier", "Sara", "Paul", "Nina"][i % 6],
        from: ["Yaounde", "Douala", "Yaounde", "Nord", "Ebolowa", "Bamenda"][
          i % 6
        ],
        to: [
          "Douala",
          "Baffoussam",
          "Garoua",
          "Yaounde",
          "Douala",
          "Yaounde",
        ][i % 6],
        price: (8 + Math.round(Math.random() * 20)).toFixed(2),
        status: ["Completed", "On going", "Cancelled"][
          Math.floor(Math.random() * 3)
        ],
      })),
    }),
    []
  );

  const lineOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 10, right: 10, bottom: 30, top: 20 },
      xAxis: {
        type: "category",
        data: sampleData.ridesByHour.map((r) => r.hour),
        boundaryGap: false,
        axisLabel: { fontSize: 11 },
      },
      yAxis: { type: "value", axisLabel: { fontSize: 11 } },
      series: [
        {
          name: "Trajets",
          type: "line",
          smooth: true,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(30,58,138,0.35)" },
                { offset: 1, color: "rgba(14,165,233,0.02)" },
              ],
            },
          },
          lineStyle: { width: 3, color: "#1e40af" },
          data: sampleData.ridesByHour.map((r) => r.rides),
        },
      ],
    }),
    [sampleData]
  );

  

 const barrOption = useMemo(
  () => ({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },

    grid: {
      top: 20,
      left: "8%",
      right: "8%",
      bottom: 30,
    },

    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#e5e7eb" } },
    },

    yAxis: {
      type: "category",
      data: cityTrips.map((c) => c.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12 },
    },

    series: [
      {
        name: "Voyages",
        type: "bar",
        data: cityTrips.map((c) => c.value),
        barWidth: 22,
        itemStyle: {
          borderRadius: [6, 6, 6, 6],
          color: "#2563eb",
        },
      },
    ],
  }),
  []
);

  const barOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      xAxis: { type: "value", axisLabel: { fontSize: 11 } },
      yAxis: {
        type: "category",
        data: sampleData.topRoutes.map((r) => r.route),
        axisLabel: { fontSize: 12 },
      },
      series: [
        {
          type: "bar",
          data: sampleData.topRoutes.map((r) => r.count),
          barWidth: 14,
          itemStyle: {
            borderRadius: 8,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#1e40af" },
                { offset: 1, color: "#0ea5e9" },
              ],
            },
          },
        },
      ],
      grid: { left: 10, right: 10, top: 10, bottom: 10 },
    }),
    [sampleData]
  );

  const cards = [
    {
      title: "Utilisateurs",
      amount: "100",
      trend: "+10.08%",
      color: "#7C3AED",
      chartColor: "#8B5CF6",
    },
    {
      title: "Utilisateurs actifs",
      amount: "90",
      trend: "-9.08%",
      color: "#F43F5E",
      chartColor: "#FB7185",
    },
    {
      title: "Nouveaux Utilisateurs",
      amount: "50",
      trend: "+12.08%",
      color: "#10B981",
      chartColor: "#34D399",
    },
    {
      title: "Conducteurs vérifiés",
      amount: "20",
      trend: "+12.08%",
      color: "#14B8A6",
      chartColor: "#2DD4BF",
    },
  ];


  const chartOptions = (color) => ({
    xAxis: {
      show: false,
      type: "category",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    yAxis: { show: false, type: "value" },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    series: [
      {
        type: "bar",
        data: [10, 6, 8, 5, 9, 12, 8, 5, 10, 12],
        barWidth: "80%",
        barGap: "5%",
        barCategoryGap: "5%",
        itemStyle: {
          color: color,
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  });

  const transactions = [
    {
      title: "Trajet : Douala -> Yaounde",
      date: "2025-01-29",
      amount: 42.9,
      paymentMethod: "Carte Bancaire",
    },
    {
      title: "Trajet : Douala -> Yaounde",
      date: "2025-01-28",
      amount: 2200.0,
      paymentMethod: "OM",
    },
    {
      title: "Trajet : Douala -> Yaounde",
      date: "2025-01-26",
      amount: -13.49,
      paymentMethod: "MOMO",
    }
  ];

  const paymentIcons = {
    MOMO: "📱",
    OM: "🟧",
    "Carte Bancaire": "💳",
    PayPal: "🅿️",
    Virement: "🏦",
  };

  if (isLoading) return <LoaderUltra loading={isLoading} />;

  return (
    <div className="text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="px-5 py-4 space-y-2 rounded-[6px] relative bg-white border transition"
          >
            <h2 className="text-gray-500 text-xs font-medium">{card.title}</h2>
            <p className="text-2xl text-gray-500 font-semibold mt-2">{card.amount}</p>

            <div className="mt-2 flex items-center gap-1">
              <span
                className={`${
                  card.trend.startsWith("-") ? "text-red-500" : "text-green-500"
                } text-sm font-medium`}
              >
                ↗ {card.trend}
              </span>
            </div>

            {/* Mini chart with ECharts */}
            <div className="absolute bottom-0 right-3 h-10">
              <ReactECharts
                option={chartOptions(card.chartColor)}
                style={{ height: "50%", width: "80%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-[6px] p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Tous les Trajets (24h)</h3>
            <div className="text-sm text-gray-500">Dernières 24 heures</div>
          </div>
          <ReactECharts option={lineOption} style={{ height: 260 }} />
        </div>

        <div className="bg-white rounded-[6px] p-4 border flex flex-col">
          <h3 className="text-md font-medium">
           Nombre de voyage par ville
          </h3>
          <ReactECharts option={barrOption} style={{ height: 280 }} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-white rounded-[6px] p-4 border">
          <h3 className="text-md font-medium mb-3">Top trajets</h3>
          <ReactECharts option={barOption} style={{ height: 220 }} />
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h3 className="text-md font-medium mb-3">Trajets récents</h3>
          <div className="space-y-2">
            {sampleData.recentRides?.slice(0, 4).map((r) => (
              <div key={r.id} className="flex border-b border-opacity-15 pb-2.5 items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-sm">
                    {r.passenger} → {r.driver}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.from} → {r.to}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">€{r.price}</div>
                  <div
                    className={`text-[.65rem] ${
                      r.status === "Completed"
                        ? "text-green-600"
                        : r.status === "Cancelled"
                        ? "text-red-500"
                        : "text-yellow-600"
                    }`}
                  >
                    {r.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h3 className="text-md font-medium mb-3">Dernière transaction</h3>

          <ScrollArea className="h-56">
            <div className="space-y-3">
              {transactions?.length ? (
                transactions.map((t, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-[.82rem] font-medium text-gray-600">
                        {t.title}
                      </p>
                      <p className="text-[.7rem] flex items-center gap-1 text-gray-400"><Calendar size={11}/>{t.date}</p>
                    </div>
                    <div className="flex flex-col text-end">
                      <p
                        className={`text-[0.8rem] font-semibold ${
                          t.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {t.amount}€
                      </p>
                      <span className="text-[0.7rem] mt-1 flex items-center gap-1 text-gray-600">
                        {paymentIcons[t.paymentMethod]} {t.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucune transaction</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// ===================== CardMetric =====================
function CardMetric({ title, value, unit, icon }) {
  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 hover:shadow-md transition">
      <div className="text-blue-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-bold text-gray-800">
          {value}
          {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
        </span>
      </div>
    </div>
  );
}
