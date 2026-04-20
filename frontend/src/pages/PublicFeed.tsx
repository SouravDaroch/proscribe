import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Layers, ArrowRight, Activity, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
            <Layers className="text-white" size={20} />
          </div>
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600 tracking-tight">
              Latest Publications
            </h2>
            <p className="text-gray-500 mt-4 text-lg font-medium">Explore the best ideas published by our community.</p>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <Activity className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900">No posts yet</h3>
              <p className="text-gray-500 mt-2">Check back later for new content from the community.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-violet-900/5 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-violet-600 font-bold text-sm shadow-inner border border-white">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{post.author.name}</h3>
                      <div className="flex items-center text-xs font-semibold text-gray-400 gap-1 mt-0.5">
                        <Clock size={12} />
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                    {post.description || post.blocks.find(b => b.type === 'text')?.content || 'Read more to explore this post.'}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-violet-600 text-sm font-bold group">
                    <span className="group-hover:translate-x-1 transition-transform">Read Article</span>
                    <ArrowRight size={16} className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default PublicFeed;
