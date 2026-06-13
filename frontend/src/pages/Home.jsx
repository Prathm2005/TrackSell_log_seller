import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "📋", title: "Log Daily Sales", desc: "Pick a product, set quantity — price fills itself. Done in seconds." },
  { icon: "📊", title: "Revenue Dashboard", desc: "Today, this week, this month — your numbers always in front of you." },
  { icon: "🏆", title: "Best Sellers", desc: "Know exactly which products earn you the most every month." },
  { icon: "📅", title: "Date Filter", desc: "Pull up any day, week, or month instantly." },
  { icon: "⬇️", title: "Export CSV", desc: "Download your sales sheet for your accountant in one click." },
  { icon: "📦", title: "Product Manager", desc: "Add products once. Reuse them every day while logging sales." },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <section className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 pt-14 pb-12 md:pt-24 md:pb-20 text-center">

          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wider uppercase">
            🇮🇳 Built for Indian Kirana Stores
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Your shop's sales,<br />
            <span className="text-indigo-400">always in order.</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Tired of writing sales in a register? Switch to something faster, simpler, and always with you.
          </p>

          {user ? (
            <Link to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-indigo-600/30">
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-indigo-600/30">
                Start for Free →
              </Link>
              <Link to="/login"
                className="inline-flex items-center bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3.5 rounded-xl font-semibold text-base border border-slate-700 transition-all">
                Login
              </Link>
            </div>
          )}

          <p className="text-slate-600 text-sm mt-6">This site is free to use · Just Login or Register</p>
        </div>
      </section>

    
      <section className="bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase text-center mb-3">Features</p>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Everything your shop needs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title}
                className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        🛒 TrackSell · Built for kirana store owners across India · © {new Date().getFullYear()} Prathmesh Malunjkar
      </footer>

    </div>
  );
}