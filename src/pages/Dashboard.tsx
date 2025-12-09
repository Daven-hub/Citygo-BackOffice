import LoaderUltra from "@/components/ui/loaderUltra";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import {
  Car,
  Users,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { RevenueChart } from "@/components/RevenueChart";
import { TopDestinations } from "@/components/TopDestinations";
import { RecentRidesTable } from "@/components/RecentRidesTable";
import { StatsCard } from "@/components/StatsCard";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const statsCard=[
    {
      title:"Revenus totaux",
      value:"FCFA 90,847",
      change:"+12.5% ce mois",
      changeTyp:"positive",
      icon:Users,
      delay:0
    },
    {
      title:"Trajets actifs",
      value:"12,847",
      change:"+8.2% cette semaine",
      changeTyp:"positive",
      icon:Car,
      delay:50
    },
    {
      title:"Destinations",
      value:"156",
      change:"23 nouvelles villes",
      changeTyp:"neutral",
      icon:MapPin,
      delay:100
    },
    {
      title:"Revenus mensuels",
      value:"FCFA 42,300",
      change:"+18.7% vs mois dernier",
      changeTyp:"positive",
      icon:TrendingUp,
      delay:150
    }
  ]

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


  if (isLoading) return <LoaderUltra loading={isLoading} />;

  return (
    <div className="text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="px-5 pt-4 pb-3.5 space-y-2 rounded-[6px] relative bg-white border transition"
          >
            <h2 className="text-gray-500 text-sm font-medium">{card.title}</h2>
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
            <div className="absolute bottom-[15%] right-3 w-14 h-5">
              <ReactECharts
                option={chartOptions(card.chartColor)}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {statsCard?.map((x,index)=>
            <StatsCard
              key={index}
              title={x.title}
              value={x.value}
              change={x.change}
              changeType={x.changeTyp}
              icon={x.icon}
              delay={0}
            />
          )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="flex flex-col">
          <TopDestinations />
        </div>
      </div>
      <RecentRidesTable />
    </div>
  );
}

export default Dashboard;
