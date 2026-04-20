import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { getExcerpt } from '../utils/getExcerpt';
import { motion } from 'framer-motion';
import { Globe, Plus, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PublishedPost = {
  _id: string;
  title?: string;
  blocks?: any;
  createdAt: string;
};

const Published = () => {
  const { posts, loading } = usePosts('published') as { posts: PublishedPost[]; loading: boolean };
  const navigate = useNavigate();

  // Loading Skeleton
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <div className="animate-pulse text-violet-600 font-bold">Loading published articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Published</span>
            <span className="text-sm font-bold text-gray-400">Your Articles</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/editor/new')}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer hover:bg-gray-100"
        >
          New Article
        </button>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex-1 w-full max-w-4xl mx-auto my-10 px-4 md:px-0"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 min-h-[75vh]">

          {/* Title Area */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600 tracking-tight">
              Published Articles
            </h2>
            <p className="text-gray-500 mt-4 text-lg font-medium">Your articles that are live and visible to everyone.</p>
          </div>

          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Published Articles
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Your articles that are live and visible to everyone.
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">No published articles yet</h3>
              <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
                Publish your first article to share it with the world.
              </p>
              <button
                onClick={() => navigate('/editor/new')}
                className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Write and Publish</span>
              </button>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default Published;
