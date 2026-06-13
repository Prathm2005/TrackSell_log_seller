import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

const Register = () => {
    const [form, setForm] = useState({ name: "", shopname: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault();;
        setError("");
        setLoading(true);
        try {
          console.log(form);
          console.log(api);
            const {data}=await api.post("/auth/register",form);
            login(data);
            navigate("/");
        } catch (error) {
          console.log(error);
          console.log(error.response?.data);
            setError(error.response?.data?.message|| "Register is failed");
        }finally{
            setLoading(false);
        }
    }
    const field = (key, label, placeholder, type = "text") => (
        <div>
          <label className="block text-sm text-slate-400 mb-1">{label}</label>
          <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            placeholder={placeholder} required />
        </div>
      );
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Start tracking your shop sales</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {field("name",     "Your Name",  "Enter your name")}
            {field("shopname", "Shop Name",  "Your store name")}
            {field("email",    "Email",      "you@example.com", "email")}
            {field("password", "Password",   "Min 6 characters", "password")}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition">
              {loading ? "Creating Plz wait..." : "Register"}
            </button>
          </form>
          <p className="text-slate-400 text-sm text-center mt-6">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register