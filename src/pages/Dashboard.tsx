import LoaderUltra from '@/components/ui/loaderUltra'
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Car, User, Star, DollarSign, ArrowDownToLine } from 'lucide-react';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ==== FAUSSES DONNEES ====
  const sampleData = useMemo(() => ({
    summary: {
      ridesToday: 1248,
      activeDrivers: 312,
      avgRating: 4.82,
      revenueToday: 2890,
    },
    ridesByHour: Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      rides: Math.round(50 + 60 * Math.abs(Math.sin(i / 3)) + Math.random() * 25),
    })),
    vehicleSplit: [
      { name: "Sedan", value: 420 },
      { name: "SUV", value: 280 },
      { name: "Van", value: 140 },
      { name: "Motorbike", value: 80 },
    ],
    topRoutes: [
      { route: "Downtown → Airport", count: 120 },
      { route: "Station → University", count: 98 },
      { route: "Mall → Business Park", count: 76 },
      { route: "North → South", count: 60 },
    ],
    recentRides: Array.from({ length: 6 }).map((_, i) => ({
      id: `RIDE-${2100 + i}`,
      passenger: ["Alice", "Bob", "Camille", "David", "Elisa", "Farid"][i % 6],
      driver: ["John", "Maria", "Olivier", "Sara", "Paul", "Nina"][i % 6],
      from: ["Downtown", "Station", "Mall", "North", "South", "Airport"][i % 6],
      to: ["Airport", "University", "Business Park", "Station", "Mall", "Downtown"][i % 6],
      price: (8 + Math.round(Math.random() * 20)).toFixed(2),
      status: ["Completed", "On going", "Cancelled"][Math.floor(Math.random() * 3)],
    })),
  }), []);

  // ==== ECHART OPTIONS ====
  const lineOption = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 10, right: 10, bottom: 30, top: 20 },
    xAxis: {
      type: "category",
      data: sampleData.ridesByHour.map(r => r.hour),
      boundaryGap: false,
      axisLabel: { fontSize: 11 },
    },
    yAxis: { type: "value", axisLabel: { fontSize: 11 } },
    series: [
      {
        name: "Rides",
        type: "line",
        smooth: true,
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(30,58,138,0.35)" },
              { offset: 1, color: "rgba(14,165,233,0.02)" },
            ],
          },
        },
        lineStyle: { width: 3, color: "#1e40af" },
        data: sampleData.ridesByHour.map(r => r.rides),
      },
    ],
  }), [sampleData]);

  const pieOption = useMemo(() => ({
    tooltip: { trigger: "item" },
    legend: { bottom: 0, textStyle: { fontSize: 12 } },
    series: [
      {
        name: "Vehicle types",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        labelLine: { show: false },
        data: sampleData.vehicleSplit,
        color: ["#1e40af", "#0ea5e9", "#f59e0b", "#10b981"],
      },
    ],
  }), [sampleData]);

  const barOption = useMemo(() => ({
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", axisLabel: { fontSize: 11 } },
    yAxis: {
      type: "category",
      data: sampleData.topRoutes.map(r => r.route),
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: "bar",
        data: sampleData.topRoutes.map(r => r.count),
        barWidth: 14,
        itemStyle: {
          borderRadius: 8,
          color: {
            type: "linear",
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: "#1e40af" }, { offset: 1, color: "#0ea5e9" }],
          },
        },
      },
    ],
    grid: { left: 10, right: 10, top: 10, bottom: 10 },
  }), [sampleData]);

  if (isLoading) return <LoaderUltra loading={isLoading} />;

  return (
    <div className="text-gray-800 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Tableau de bord</h2>
          <div className="text-xs text-gray-400">Vue d'ensemble en temps réel</div>
        </div>
        <button className="bg-blue-600 flex items-center gap-1 text-white text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
          <ArrowDownToLine size={16}/> Générer un rapport
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardMetric title="Trajets aujourd'hui" value={sampleData.summary.ridesToday} icon={<Car size={24} />} />
        <CardMetric title="Conducteurs actifs" value={sampleData.summary.activeDrivers} icon={<User size={24} />} />
        <CardMetric title="Note moyenne" value={sampleData.summary.avgRating} unit="★" icon={<Star size={24} />} />
        <CardMetric title="Revenus (aujourd'hui)" value={sampleData.summary.revenueToday} unit="€" icon={<DollarSign size={24} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Trajets (24h)</h3>
            <div className="text-sm text-gray-500">Dernières 24 heures</div>
          </div>
          <ReactECharts option={lineOption} style={{ height: 260 }} />
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm flex flex-col">
          <h3 className="text-lg font-medium mb-2">Répartition des véhicules</h3>
          <ReactECharts option={pieOption} style={{ height: 220 }} />
          <div className="mt-2 text-xs text-gray-500">Données en pourcentage</div>
        </div>
      </div>

      {/* Lower Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h3 className="text-lg font-medium mb-3">Top trajets</h3>
          <ReactECharts option={barOption} style={{ height: 220 }} />
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h3 className="text-lg font-medium mb-3">Trajets récents</h3>
          <div className="space-y-3">
            {sampleData.recentRides?.slice(0,4).map(r => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.passenger} → {r.driver}</div>
                  <div className="text-sm text-gray-500">{r.from} → {r.to}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">€{r.price}</div>
                  <div className={`text-xs ${r.status === 'Completed' ? 'text-green-600' : r.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-600'}`}>{r.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h3 className="text-lg font-medium mb-3">Carte (placeholder)</h3>
          <div className="h-48 rounded-md bg-gradient-to-br from-gray-100 to-gray-50 border flex items-center justify-center text-sm text-gray-400">
            Intégrer une vraie carte (Mapbox, Leaflet) ici
          </div>
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
          {value}{unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
        </span>
      </div>
    </div>
  );
}
