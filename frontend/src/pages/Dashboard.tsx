import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    /* Added 'font-sans' and changed global text color for better readability */
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans antialiased text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-200">
              P
            </div>
            <h1 className="text-xl font-semibold tracking-tight">ProScribe.</h1>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 font-medium transition-all group cursor-pointer">
              <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
              All Drafts
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all group cursor-pointer">
              <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
              Published
            </button>
          </nav>

          <div className="mt-10">
            <button 
              onClick={() => navigate('/editor/new')}
              className="w-full bg-violet-600 text-white font-semibold py-3.5 rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-lg">+</span> New Article
            </button>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
              {/* <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role || 'Writer'}</p> */}
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full mt-3 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors py-2 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Your Workshop</h2>
            <p className="text-gray-500 mt-2 font-medium">Capture ideas and document your technical journey.</p>
          </div>
        </header>

        {/* Quick Stats Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Drafts', count: '0', icon: '📝', color: 'bg-blue-50 text-blue-600' },
            { label: 'Published', count: '0', icon: '🚀', color: 'bg-green-50 text-green-600' },
            { label: 'Views', count: '0', icon: '🔥', color: 'bg-orange-50 text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className={`p-2 rounded-lg text-xl ${stat.color}`}>{stat.icon}</span>
                <span className="text-2xl font-semibold text-gray-900">{stat.count}</span>
              </div>
              <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center text-center p-8 transition-all hover:border-violet-200 hover:bg-violet-50/10">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            ✍️
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">Your story starts here</h3>
          <p className="text-gray-400 max-w-sm mt-3 leading-relaxed font-medium">
            Every great piece of documentation begins with a single block. Ready to write something amazing?
          </p>
          <button 
            onClick={() => navigate('/editor/new')}
            className="mt-8 px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 active:scale-95 cursor-pointer"
          >
            Create First Draft
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;