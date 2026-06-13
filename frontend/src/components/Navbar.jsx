import { useLocation, Link} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const active = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false); 

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 md:px-6 py-4">

      
      <div className="flex items-center justify-between">

       
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">🛒 TrackSell</span>
          {user && <span className="text-slate-500 text-sm hidden sm:block">{user.shopName}</span>}
        </Link>

       
        {user && (
          <div className="hidden md:flex gap-2">
            {[
              { path: "/",         label: "📊 Dashboard" },
              { path: "/sales",    label: "📋 Sales Log" },
              { path: "/products", label: "📦 Products"  },
            ].map(({ path, label }) => (
              <Link key={path} to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active(path)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                {label}
              </Link>
            ))}
          </div>
        )}

        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-slate-400 text-sm hidden sm:block">Hi, {user.name}</span>
              <button onClick={logout}
                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active("/login")
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                Login
              </Link>
              <Link to="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition">
                Register
              </Link>
            </>
          )}

          
          {user && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-800 transition">
              <span className={`block w-5 h-0.5 bg-slate-400 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-400 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-400 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          )}
        </div>
      </div>

    
      {user && menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-1 border-t border-slate-800 pt-3">
          {[
            { path: "/",         label: "📊 Dashboard" },
            { path: "/sales",    label: "📋 Sales Log" },
            { path: "/products", label: "📦 Products"  },
          ].map(({ path, label }) => (
            <Link key={path} to={path}
              onClick={() => setMenuOpen(false)} 
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                active(path)
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              {label}
            </Link>
          ))}
          <p className="text-slate-500 text-xs px-4 py-2">Hi, {user.name}</p>
        </div>
      )}

    </nav>
  );
};

export default Navbar;