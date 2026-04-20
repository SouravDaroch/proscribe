import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts'; // 
import { getExcerpt } from '../utils/getExcerpt'
import { motion } from 'framer-motion';
import { FileText, Globe, Plus, Flame, PenTool, ExternalLink, Menu } from 'lucide-react';
import { useState } from 'react';
import { useMobileSidebar } from '../hooks/useMobileSidebar';
import Sidebar from '../components/Sidebar';

type DashboardPost = {
  _id: string;
  title?: string;
  blocks?: any;
  createdAt: string;
  status: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const { posts, loading } = usePosts(filter === 'all' ? undefined : filter) as { posts: DashboardPost[]; loading: boolean };
  const { posts: allPosts } = usePosts() as { posts: DashboardPost[] };
  const { isMobile, isSidebarOpen, toggleSidebar, closeSidebar } = useMobileSidebar();

  // Calculate real-time counts
  const draftCount = allPosts.filter(post => post.status === 'draft').length;
  const publishedCount = allPosts.filter(post => post.status === 'published').length;

  //  Loading Skeltons 
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <div className="animate-pulse text-violet-600 font-bold">Loading your workshop...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={!isMobile || isSidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex-1 overflow-y-auto"
      >
        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
        >
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button - Mobile Only */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Dashboard</span>
              <span className="text-sm font-bold text-gray-400">Your Workshop</span>
            </div>
          </div>


        </motion.header>

        {/* Content Header */}
        <div className="p-8 md:p-12">
          <header className="flex-col gap-2 md:flex md:flex-row justify-between items-start mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {filter === 'published' ? 'Published Articles' : filter === 'all' ? 'Your Workshop' : 'Drafts'}
              </h2>
              <p className="text-gray-500 mt-2">
                {filter === 'published'
                  ? 'Your published articles visible to everyone.'
                  : filter === 'all'
                    ? 'Capture ideas and document your technical journey.'
                    : 'Your draft articles - work in progress.'
                }
              </p>
            </div>
            {/* Filter Buttons */}
            <div className="mt-3 flex gap-2 bg-gray-50 p-2 rounded-lg">
              {(['all', 'draft', 'published'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === filterType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {filterType === 'all' ? 'All' : filterType === 'draft' ? 'Drafts' : 'Published'}
                </button>
              ))}
            </div>
          </header>

          {/* Quick Stats Block - Only show for all posts view */}
          {filter === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Total Drafts', count: draftCount, icon: <FileText className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
                { label: 'Published', count: publishedCount, icon: <Globe className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
                { label: 'Views', count: '0', icon: <Flame className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</span>
                    <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
                  </div>
                  <p className="mt-5 text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Content: List of Posts OR Empty State */}
          {posts.length > 0 ? (
            <>
              {filter === 'all' && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    Recent Posts
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your latest articles, sorted by most recent.
                  </p>
                </div>
              )}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                key={filter}
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                        {post.title || "Untitled Article"}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {getExcerpt(post.blocks, 120)}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-violet-500 uppercase tracking-tighter bg-violet-50 px-2 py-1 rounded-md">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/post/${post._id}`}
                        className="flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-violet-600 transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            /* Show contextual Empty State based on filter */
            <div className="bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-16 shadow-sm transition-all group">
              <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6 text-violet-500 group-hover:bg-violet-100 transition-colors">
                {filter === 'published' ? <Globe className="w-8 h-8" /> : <PenTool className="w-8 h-8" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {filter === 'published'
                  ? 'No published articles yet'
                  : filter === 'draft'
                    ? 'No draft articles'
                    : 'Your story starts here'
                }
              </h3>
              <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
                {filter === 'published'
                  ? 'Publish your first article to share it with the world.'
                  : filter === 'draft'
                    ? 'Start writing and save your work as a draft.'
                    : 'Every great piece of documentation begins with a single block. Ready to write something amazing?'
                }
              </p>
              <button
                onClick={() => navigate('/editor/new')}
                className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>{filter === 'published' ? 'Write and Publish' : 'Create First Draft'}</span>
              </button>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;