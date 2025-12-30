import LoaderUltra from "@/components/ui/loaderUltra";
import React, { useState, useEffect } from "react";
import { Car, Users, MapPin, TrendingUp } from "lucide-react";
import { TopDestinations } from "@/components/TopDestinations";
import { RecentRidesTable } from "@/components/RecentRidesTable";
import { StatsCard } from "@/components/StatsCard";
import { UserStatOverview } from "@/components/UserStatOverview";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { AnalyticsUser, AnalyticsWithMetric } from "@/store/slices/user.slice";
import { UserTrendOverview } from "@/components/UserTrendOverview";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [periode, setPeriode] = useState("MONTH");
  const [period, setPeriod] = useState("MONTH");
  const [metric, setMetric] = useState("ALL");
  const { analytics, analyticMetric } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const data = { period, metric };
    const fetchData = async () => {
      const start = performance.now();
      await Promise.all([
        dispatch(AnalyticsUser(periode)),
        dispatch(AnalyticsWithMetric(data)),
      ]);
      const end = performance.now();
      const elapsed = end - start;
      setDuration(elapsed);
      setTimeout(() => setIsLoading(false), Math.max(400, elapsed));
    };
    fetchData();
  }, [dispatch, periode, period, metric]);

  const statsCard = [
    {
      title: "Revenus totaux",
      value: "CFA 90,847",
      change: "+12.5% ce mois",
      changeTyp: "positive",
      icon: Users,
      delay: 0,
    },
    {
      title: "Trajets actifs",
      value: "12,847",
      change: "+8.2% cette semaine",
      changeTyp: "positive",
      icon: Car,
      delay: 50,
    },
    {
      title: "Destinations",
      value: "156",
      change: "23 nouvelles villes",
      changeTyp: "neutral",
      icon: MapPin,
      delay: 100,
    },
    {
      title: "Revenus mensuels",
      value: "CFA 42,300",
      change: "+18.7% vs mois dernier",
      changeTyp: "positive",
      icon: TrendingUp,
      delay: 150,
    },
  ];

  if (isLoading) return <LoaderUltra duration={duration} loading={isLoading} />;

  return (
    <div className="text-gray-800 space-y-5 min-h-screen">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
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
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCard?.map((x, index) => (
          <StatsCard
            key={index}
            title={x.title}
            value={x.value}
            change={x.change}
            changeType={x.changeTyp}
            icon={x.icon}
            delay={0}
          />
        ))}
      </div>
      <UserStatOverview
        stats={analytics}
        periode={periode}
        setPeriode={setPeriode}
      />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          {/* <RevenueChart /> */}
          <UserTrendOverview
            data={analyticMetric}
            period={period}
            setPeriod={setPeriod}
            metric={metric}
            setMetric={setMetric}
          />
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
