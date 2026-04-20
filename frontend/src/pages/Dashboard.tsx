import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts'; // 
import { getExcerpt } from '../utils/getExcerpt'
import { motion } from 'framer-motion';
import { FileText, Globe, Plus, Flame, PenTool, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

type DashboardPost = {
  _id: string;
  title?: string;
  blocks?: any;
  createdAt: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const { posts, loading } = usePosts(filter === 'all' ? undefined : filter) as { posts: DashboardPost[]; loading: boolean };




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
      <Sidebar />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex-1 p-8 md:p-12 overflow-y-auto"
      >
        <header className="flex justify-between items-start mb-12">
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
        </header>

        {/* Quick Stats Block - Only show for all posts view */}
        {filter === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Drafts', count: posts.length, icon: <FileText className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Published', count: '0', icon: <Globe className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
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
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {filter === 'published' ? 'Published Articles' : filter === 'draft' ? 'Draft Articles' : 'Recent Posts'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {filter === 'published'
                  ? 'Your articles that are live and visible to everyone.'
                  : filter === 'draft'
                    ? 'Your draft articles that are still in progress.'
                    : 'Your latest articles, sorted by most recent.'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
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
            </div>
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
      </motion.main>
    </div>
  );
};

export default Dashboard;