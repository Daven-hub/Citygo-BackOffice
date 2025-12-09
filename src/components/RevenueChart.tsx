import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 12400, rides: 340 },
  { month: "Fév", revenue: 15200, rides: 420 },
  { month: "Mar", revenue: 18600, rides: 510 },
  { month: "Avr", revenue: 22100, rides: 590 },
  { month: "Mai", revenue: 28500, rides: 720 },
  { month: "Juin", revenue: 32800, rides: 850 },
  { month: "Juil", revenue: 38200, rides: 980 },
  { month: "Août", revenue: 35600, rides: 920 },
  { month: "Sep", revenue: 31200, rides: 810 },
  { month: "Oct", revenue: 34800, rides: 890 },
  { month: "Nov", revenue: 39500, rides: 1020 },
  { month: "Déc", revenue: 42300, rides: 1100 },
];

export function RevenueChart() {
  return (
    <div className="rounded-[6px] border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenus mensuels</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(30,58,138,0.35)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="rgba(14,165,233,0.02)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid ray",
                borderRadius: "8px",
                // boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
              labelStyle={{ color: "rgb(118 118 118/.8)", fontWeight: 600 }}
              itemStyle={{ color: "rgba(30,58,138,0.85)" }}
              formatter={(value: number) => [`${value.toLocaleString()} FCFA`, "Revenus"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="rgba(30,58,138,0.35)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
