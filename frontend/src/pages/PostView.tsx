import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, BookOpen, Edit3, Trash2, FileText, Globe } from 'lucide-react';
import ConfirmDeleteModal from '../components/ConfirmDelete';

// Estimate read time from blocks
const getReadingTime = (blocks: any[]): number => {
  const words = blocks
    .map((b: any) => (b.content || '').split(/\s+/).filter(Boolean).length)
    .reduce((a: number, b: number) => a + b, 0);
  return Math.max(1, Math.ceil(words / 200));
};

// Block type badge colors
const blockTypeMeta: Record<string, { label: string; color: string }> = {
  text: { label: 'Paragraph', color: 'bg-blue-50 text-blue-600' },
  heading: { label: 'Heading', color: 'bg-violet-50 text-violet-600' },
  code: { label: 'Code', color: 'bg-gray-100 text-gray-600' },
};

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        // console.log(data)
        setPost(data);
        // Load user to check permissions
        const storedUser = localStorage.getItem('user');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to fetch post", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error("Delete failed", error);
    }
  };


  // Loading State — matches Dashboard skeleton style
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white to-sky-100">
        <div className="animate-pulse text-violet-600 font-bold">Loading article...</div>
      </div>
    );
  }

  if (!post) return null;

  // PERMISSION CHECK
  const isAuthor = currentUser?._id === post.author?._id;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;

  const authorName = post.author?.name || post.author?.username || post.author?.email || 'Unknown Author';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const readingTime = getReadingTime(post.blocks);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900">

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={post.title}
      />

      {/* ── Sidebar accent strip (mirrors Dashboard sidebar) ── */}
      <div className="w-1.5 bg-linear-to-b from-sky-500 to-violet-600 shrink-0" />

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky Nav */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
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
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Reading</span>
              <span className="text-sm font-bold text-gray-400">ProScribe Article</span>
            </div>
          </div>

          {/* Status and Reading time chips */}
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border">
              {post.status === 'draft' ? (
                <>
                  <FileText size={14} className="text-blue-500" />
                  <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Draft</span>
                </>
              ) : (
                <>
                  <Globe size={14} className="text-green-500" />
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Published</span>
                </>
              )}
            </div>

            {canEdit && (
              <div className="flex items-center gap-2 mr-4 pr-4 border-r border-gray-100">
                <button
                  onClick={() => navigate(`/edit-post/${id}`)}
                  className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all cursor-pointer"
                >
                  <Edit3 size={18} />
                </button>
                {canDelete && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
              <Clock size={13} className="text-violet-400" />
              {readingTime} min read
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <motion.main
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex-1 overflow-y-auto p-8 md:p-12"
        >
          <div className="max-w-3xl mx-auto">

            {/* ── Article Card (matches Dashboard post cards) ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 md:p-14">

              {/* Author + Meta row */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  {authorInitial}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{authorName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <Calendar size={11} /> {formattedDate}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <BookOpen size={11} /> {post.blocks.length} block{post.blocks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="flex items-center gap-1.5">
                  {post.status === 'draft' ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100">
                      <FileText size={12} />
                      Draft
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-tighter bg-green-50 px-2.5 py-1.5 rounded-md border border-green-100">
                      <Globe size={12} />
                      Published
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-10 leading-tight">
                {post.title}
              </h1>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-sky-200 via-violet-200 to-transparent mb-10" />

              {/* Content Blocks */}
              <div className="space-y-6">
                {post.blocks.map((block: any, index: number) => {
                  switch (block.type) {
                    case 'text':
                      return (
                        <motion.p
                          key={block._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + index * 0.05 }}
                          className="text-lg leading-relaxed text-gray-600"
                        >
                          {block.content}
                        </motion.p>
                      );
                    case 'heading':
                      return (
                        <motion.h2
                          key={block._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + index * 0.05 }}
                          className="text-2xl font-bold text-gray-900 mt-10 mb-2 border-l-4 border-violet-500 pl-4"
                        >
                          {block.content}
                        </motion.h2>
                      );
                    case 'code':
                      return (
                        <motion.div
                          key={block._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + index * 0.05 }}
                          className="relative"
                        >
                          <div className="flex items-center gap-2 bg-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-t-xl">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            <span className="ml-2">Code</span>
                          </div>
                          <pre className="bg-gray-900 text-green-300 text-sm leading-relaxed p-6 rounded-b-xl overflow-x-auto font-mono border border-gray-700 shadow-lg">
                            <code>{block.content}</code>
                          </pre>
                        </motion.div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              {/* Footer */}
              <div className="mt-14 pt-8 border-t border-gray-50 flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">End of Article</p>
                <div className="flex items-center gap-2">
                  {Object.entries(blockTypeMeta)
                    .filter(([type]) => post.blocks.some((b: any) => b.type === type))
                    .map(([type, meta]) => (
                      <span key={type} className={`text-[10px] font-bold px-2 py-1 rounded-md ${meta.color}`}>
                        {meta.label}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Back button below card */}
            <div className="mt-8 flex justify-start">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold text-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:text-violet-600 transition-all cursor-pointer group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Workshop
              </button>
            </div>

          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default PostView;