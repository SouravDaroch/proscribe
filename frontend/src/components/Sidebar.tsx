import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Globe, Layers, Plus, Users } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-68 bg-linear-to-br from-sky-500 to-violet-600 flex flex-col shadow-xl z-10 text-white">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-violet-600  flex items-center justify-center shadow-md shadow-violet-100/30">
            <Layers className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">ProScribe.</h1>

        </div>

        <nav className="space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group cursor-pointer border text-violet-100 hover:bg-white/10 hover:text-white border-white/5 shadow-sm"
          >
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            All Drafts
          </button>
          <button
            onClick={() => navigate('/feed')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-100 hover:bg-white/10 hover:text-white font-medium transition-all group cursor-pointer border border-transparent"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Public Feed
          </button>
          <button
            onClick={() => navigate('/published')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-100 hover:bg-white/10 hover:text-white font-medium transition-all group cursor-pointer border border-transparent"
          >
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
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white font-medium capitalize">
                {user?.role || 'user'}
              </span>
              <p className="text-xs text-violet-200 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 text-xs font-semibold text-violet-200 hover:text-white transition-colors py-2 cursor-pointer uppercase tracking-wider"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
