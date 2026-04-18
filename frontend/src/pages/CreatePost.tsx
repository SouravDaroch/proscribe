import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Type, Heading1, ArrowLeft, Send, Code, Sparkles } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import EditorBlock from '../components/editor/EditorBlock';
import { useCreatePost } from '../hooks/useCreatePost';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const CreatePost = () => {
  const { 
    register, 
    handleSubmit, 
    fields, 
    append, 
    remove, 
    move,
    onSubmit, 
    navigate, 
    isPublishing,
    formState: { errors } 
  } = useCreatePost();

  const sensors = useSensors(
   useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }, 
  }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-sky-100 font-sans antialiased text-gray-900 flex flex-col">
      
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Editor</span>
            <span className="text-sm font-bold text-gray-400">Draft in ProScribe</span>
          </div>
        </div>

        <button
          disabled={isPublishing}
          onClick={handleSubmit(onSubmit)}
          className="group bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          )}
          {isPublishing ? 'Saving...' : 'Publish'}
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
          
          {/* Title Input Area */}
          <div className="relative mb-12">
            <input
              {...register('title')}
              placeholder="Post Title..."
              className={`w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder-gray-200 bg-transparent tracking-tight transition-colors ${
                errors.title ? 'text-red-500' : 'text-gray-900'
              }`}
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm font-semibold mt-4 flex items-center gap-1.5 pl-2"
                >
                  <Sparkles size={14} /> {errors.title.message as string}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Canvas of Blocks */}
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((field, index) => (
                  <EditorBlock
                    key={field.id}
                    id={field.id}
                    index={index}
                    type={field.type}
                    register={register}
                    onRemove={() => remove(index)}
                    error={(errors.blocks as any)?.[index]?.content}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Validation Summary for Blocks */}
          {errors.blocks && typeof errors.blocks.message === 'string' && (
            <p className="text-red-500 text-sm font-semibold mt-6 ml-2">
              {errors.blocks.message}
            </p>
          )}

          {/* Floating Action Bar */}
          <footer className="mt-16 pt-8 border-t border-gray-50 flex flex-wrap gap-4">
            <BlockButton 
              icon={<Type size={18} />} 
              label="Add Text" 
              onClick={() => append({ type: 'text', content: '' })} 
            />
            <BlockButton 
              icon={<Heading1 size={18} />} 
              label="Add Heading" 
              onClick={() => append({ type: 'heading', content: '' })} 
            />
            <BlockButton 
              icon={<Code size={18} />} 
              label="Add Code" 
              onClick={() => append({ type: 'code', content: '' })} 
            />
          </footer>
        </div>
      </motion.main>
    </div>
  );
};

// Refined Reusable Button
const BlockButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all font-semibold text-sm border border-transparent shadow-sm"
  >
    <span className="text-gray-400 group-hover:text-gray-600 transition-colors">{icon}</span>
    {label}
  </button>
);

export default CreatePost;