import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LineChart,
  LogOut,
  Menu,
  Search,
  Settings,
  Wallet,
} from 'lucide-react';
import { useAuth } from './AuthContext';

const navItems = [
  { label: 'Overview', icon: Home },
  { label: 'Analytics', icon: LineChart },
  { label: 'Wallet', icon: Wallet },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Settings', icon: Settings },
  { label: 'Logout', icon: LogOut },
];

const stats = [
  { label: 'Total Balance', value: '$48,230', delta: '+4.2%' },
  { label: 'Monthly Revenue', value: '$12,980', delta: '+1.8%' },
  { label: 'Active Users', value: '8,431', delta: '+3.5%' },
  { label: 'Churn Rate', value: '1.2%', delta: '-0.3%' },
];

const activities = [
  { title: 'Payment received', subtitle: 'From Alpine Traders', amount: '+$1,240', time: '2h ago' },
  { title: 'Payout initiated', subtitle: 'To Everest Supplies', amount: '-$980', time: '5h ago' },
  { title: 'New signup', subtitle: 'KTM Retailers', amount: 'User', time: '6h ago' },
  { title: 'Invoice sent', subtitle: '#INV-2043', amount: '$2,310', time: '1d ago' },
];

function Sidebar({ open, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 240 : 84 }}
      className="relative h-screen bg-gradient-to-b from-[#0d0f1a] to-[#0b0d18] text-slate-100 border-r border-white/5 shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-800/50" />
          {open && <span className="text-lg font-semibold">NovaDash</span>}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
      <nav className="mt-4 space-y-1 px-2">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white transition"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-indigo-200 group-hover:bg-indigo-500/10 group-hover:text-white transition">
              <Icon className="h-4 w-4" />
            </span>
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}

function Header({ onMenu, user, onLogout }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#0f1224]/80 backdrop-blur-xl px-5 py-4 border-b border-white/5">
      <div className="flex items-center gap-3 w-full max-w-xl">
        <button onClick={onMenu} className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
          <Menu className="h-5 w-5 text-slate-100" />
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-full">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder="Search dashboards, users, transactions..."
            className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500 w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
          <Bell className="h-5 w-5 text-slate-100" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.18)]" />
        </button>
        <UserMenuDropdown user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}

function UserMenuDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 pr-3 border border-white/10 hover:bg-white/10 transition"
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-white/10 shadow-lg shadow-indigo-800/50" />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm text-slate-100">{user?.name || 'User'}</span>
          <span className="text-xs text-slate-400">{user?.role || 'member'}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101327] border border-white/10 shadow-2xl shadow-black/50 p-2"
          >
            {['Profile', 'Billing', 'Teams'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-white/5 transition"
              >
                {item}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-rose-200 hover:bg-white/5 transition"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, delta }) {
  const positive = delta.startsWith('+');
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/30 backdrop-blur"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        <span className={`text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {delta}
        </span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-white/5">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
          style={{ width: `${Math.min(95, Math.abs(parseFloat(delta)) * 10)}%` }}
        />
      </div>
    </motion.div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/30 backdrop-blur h-64 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300 font-semibold">Performance</p>
        <span className="text-xs text-slate-400">Last 30 days</span>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-2 h-full items-end">
        {[40, 55, 48, 62, 70, 64, 80, 76, 72, 68, 85, 90].map((h, i) => (
          <div key={i} className="relative flex flex-col justify-end">
            <div className="w-full rounded-lg bg-gradient-to-t from-indigo-600 to-purple-500" style={{ height: `${h}%` }} />
            <span className="absolute -bottom-6 text-[10px] text-slate-500">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityList() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-300 font-semibold">Recent activity</p>
        <button className="text-xs text-cyan-300 hover:text-cyan-200 transition">View all</button>
      </div>
      <div className="space-y-3">
        {activities.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 border border-white/5"
          >
            <div>
              <p className="text-sm text-white">{item.title}</p>
              <p className="text-xs text-slate-400">{item.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-200">{item.amount}</p>
              <p className="text-[11px] text-slate-500">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CTAWidget() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#1a1f3a] via-[#151a30] to-[#0f1224] border border-white/10 p-4 shadow-2xl shadow-black/40 flex items-center justify-between">
      <div>
        <p className="text-sm text-cyan-200 font-semibold">AI restock insights</p>
        <p className="text-xs text-slate-300 mt-1">Predict demand and avoid stockouts with one click.</p>
      </div>
      <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-800/50 hover:shadow-indigo-700/60 transition">
        Generate
      </button>
    </div>
  );
}

function DashboardLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const content = useMemo(
    () => (
      <div className="flex min-h-screen bg-[#0a0d1a] text-white">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        <div className="flex-1 flex flex-col">
          <Header onMenu={() => setSidebarOpen((v) => !v)} user={user} onLogout={onLogout} />
          <main className="p-5 space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <ChartPlaceholder />
              </div>
              <div className="space-y-4">
                <CTAWidget />
                <ActivityList />
              </div>
            </div>
          </main>
        </div>
      </div>
    ),
    [sidebarOpen]
  );

  return content;
}

export default function App() {
  const { user, loading, error, setError, login, register, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'retailer',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        setStatus('Logged in successfully');
      } else {
        await register(form.name, form.email, form.password, form.role);
        setStatus('Account created. Redirecting to dashboard...');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setStatus('');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#0a0d1a] text-white flex items-center justify-center">
        <div className="animate-pulse text-slate-300">Loading session...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0d1a] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">BizSync</p>
              <h1 className="text-xl font-semibold text-white">Access your dashboard</h1>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-800/50" />
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold border ${
                mode === 'login'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold border ${
                mode === 'register'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              Register
            </button>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-200">Full name</label>
                <input
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  name="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Email</label>
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Password</label>
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                name="password"
                type="password"
                minLength={8}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-200">Role</label>
                <select
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="retailer">Retailer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
            )}
              {error && <div className="text-sm text-rose-300 bg-rose-900/30 border border-rose-800/50 rounded-xl px-3 py-2">{error}</div>}
              {status && <div className="text-sm text-emerald-200 bg-emerald-900/30 border border-emerald-800/50 rounded-xl px-3 py-2">{status}</div>}
            <button
              type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-800/40 hover:shadow-indigo-700/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <DashboardLayout user={user} onLogout={logout} />;
}
