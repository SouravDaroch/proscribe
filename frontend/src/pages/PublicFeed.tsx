import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Layers, ArrowRight, Activity, Clock, Plus, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Author {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  description?: string;
  author: Author;
  createdAt: string;
  blocks: any[];
}

const PublicFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await api.get('/posts/public');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch public feed', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
        >
          <div className="flex items-center gap-4">
          
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Public Feed</span>
              <span className="text-sm font-bold text-gray-400">Discover Ideas</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer hover:bg-gray-100"
          >
            Go to Dashboard
          </button>
        </motion.header>

        {/* Editor Surface */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full max-w-4xl mx-auto my-10 px-4 md:px-0"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 min-h-[75vh]">

            {/* Title Area */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-violet-600 tracking-tight">
                  Community Discover
                </h2>
              </div>
              <p className="text-gray-500 mt-4 text-lg font-medium">Explore amazing content published by our talented community.</p>
            </div>

            {/* Section Header */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Latest Publications
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Discover trending content from our vibrant community.
              </p>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-linear-to-br from-blue-50 to-cyan-100 rounded-full flex items-center justify-center mb-8 text-blue-500 shadow-lg">
                  <Activity className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">No community posts yet</h3>
                <p className="text-gray-500 max-w-md mt-4 leading-relaxed">
                  Be the first to share your knowledge with our talented community!
                </p>
                <button
                  onClick={() => navigate('/editor/new')}
                  className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg active:scale-[0.98] cursor-pointer group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create First Post</span>
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pt-1"
              >
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-violet-900/10 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/50">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-left">
                            <h3 className="text-sm font-bold text-gray-900 mb-1">{post.author.name}</h3>
                            <div className="flex items-center text-xs font-semibold text-gray-500 gap-2">
                              <Clock size={12} />
                              <span>{new Date(post.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3  transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>

                      <p className="text-gray-500 text-base leading-relaxed line-clamp-4 mb-6 flex-1">
                        {post.description || post.blocks.find(b => b.type === 'text')?.content || 'Read more to explore this post.'}
                      </p>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">Community</span>
                          <span className="text-xs text-violet-500 uppercase tracking-wider bg-violet-50 px-3 py-1 rounded-full">{new Date(post.createdAt).toLocaleDateString()}</span>
                          <div className="flex-1"></div>
                        </div>
                        <Link
                          to={`/post/${post._id}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-center text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 "
                        >
                          Read Article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default PublicFeed;
