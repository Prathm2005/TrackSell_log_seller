import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "../api/axios"

const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      api.get("/sale/summary")
        .then(({ data }) => setSummary(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);
    
    if (loading || !summary||!summary.last7Days ||
      !summary.bestSellers) {
      return (
        <div className="text-center text-slate-400 py-20">
          Loading dashboard...
        </div>
      );
    } 
  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
    <div className="max-w-5xl mx-auto">

     
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Your shop performance at a glance</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Today's Revenue",      value: summary.today,     color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
          { label: "This Week's Revenue",  value: summary.thisWeek,  color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20"  },
          { label: "This Month's Revenue", value: summary.thisMonth, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 border ${card.bg}`}>
            <div className={`text-3xl font-bold ${card.color}`}>{rupee(card.value)}</div>
            <div className="text-slate-400 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Last 7 Days Revenue</h2>
          {summary?.last7Days?.every((d) => d.total === 0) ? (
            <div className="text-slate-400 text-sm text-center py-10">No sales data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summary?.last7Days || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [rupee(val), "Revenue"]}
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {(summary?.last7Days||[]).map((_, i) => (
                    <Cell key={i} fill={i === 6 ? "#6366f1" : "#334155"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

       
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">🏆 Best Sellers This Month</h2>
          {summary.bestSellers.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-10">No sales logged yet</div>
          ) : (
            <div className="space-y-3">
              {summary.bestSellers.map((item, i) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medals[i]}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{item._id}</div>
                      <div className="text-slate-400 text-xs">{item.totalQty} units sold</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-semibold text-sm">{rupee(item.totalRevenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Dashboard