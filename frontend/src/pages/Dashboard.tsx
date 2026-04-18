import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Globe, Plus, Rocket, Flame, PenTool } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-linear-to-br from-sky-500 to-violet-600 flex flex-col shadow-xl z-10 text-white">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <h1 className="text-3xl font-bold tracking-tight">ProScribe.</h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium transition-all group cursor-pointer hover:bg-white/20 border border-white/5 shadow-sm">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              All Drafts
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-100 hover:bg-white/10 hover:text-white font-medium transition-all group cursor-pointer border border-transparent">
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Published
            </button>
          </nav>

          <div className="mt-10">
            <button
              onClick={() => navigate('/editor/new')}
              className="w-full bg-white text-violet-700 font-bold py-3.5 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
              <span>New Article</span>
            </button>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 bg-white text-violet-600 rounded-full flex items-center justify-center font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-violet-200 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-4 text-xs font-semibold text-violet-200 hover:text-white transition-colors py-2 cursor-pointer uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex-1 p-8 md:p-12 overflow-y-auto"
      >
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Workshop</h2>
            <p className="text-gray-500 mt-2">Capture ideas and document your technical journey.</p>
          </div>
        </header>

        {/* Quick Stats Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Drafts', count: '0', icon: <FileText className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Published', count: '0', icon: <Rocket className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
            { label: 'Views', count: '0', icon: <Flame className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
              </div>
              <p className="mt-5 text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-16 shadow-sm transition-all group">
          <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6 shadow-inner text-violet-500 group-hover:bg-violet-100 transition-colors duration-300">
            <PenTool className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Your story starts here</h3>
          <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
            Every great piece of documentation begins with a single block. Ready to write something amazing?
          </p>
          <button
            onClick={() => navigate('/editor/new')}
            className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Draft</span>
          </button>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;