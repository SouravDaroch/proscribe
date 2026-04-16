import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-violet-600 mb-8">ProScribe</h1>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-violet-50 text-violet-700 font-medium">
              All Drafts
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
              Published
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition font-bold text-violet-600 mt-4">
              + New Article
            </button>
          </nav>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <button 
            onClick={logout}
            className="text-xs text-red-500 hover:underline mt-1"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Articles</h2>
        </header>

        {/* Empty State (We'll replace this with real data soon) */}
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-400">
          <p>No articles yet.</p>
          <button className="mt-4 text-violet-600 font-semibold hover:text-violet-700">
            Create your first draft →
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;