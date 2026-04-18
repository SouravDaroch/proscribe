import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostFormInputs } from '../../../shared/schema/validation.js';
import EditorBlock from '../components/editor/EditorBlock';

const CreatePost = () => {
  const { register, control, handleSubmit } = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      blocks: [{ id: crypto.randomUUID(), type: 'text', content: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'blocks',
  });

  const onSubmit = (data: PostFormInputs) => {
    console.log("Submitting to Backend:", data);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation / Actions */}
      <header className="flex justify-between items-center px-10 py-4 border-b">
        <span className="text-sm font-medium text-gray-500">Draft in ProScribe</span>
        <button 
          onClick={handleSubmit(onSubmit)}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
        >
          Publish
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-16 px-6">
        {/* Title Field */}
        <input
          {...register('title')}
          placeholder="New Post Title..."
          className="w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder-gray-200 mb-4"
        />

        {/* Blocks Area */}
        <div className="mt-10 space-y-2">
          {fields.map((field, index) => (
            <EditorBlock
              key={field.id}
              index={index}
              type={field.type}
              register={register}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        {/* Add Block Menu */}
        <div className="mt-12 flex gap-4 border-t pt-6">
          <button
            type="button"
            onClick={() => append({ id: crypto.randomUUID(), type: 'text', content: '' })}
            className="text-gray-400 hover:text-indigo-600 text-sm flex items-center gap-1"
          >
            + Add Text
          </button>
          <button
            type="button"
            onClick={() => append({ id: crypto.randomUUID(), type: 'heading', content: '' })}
            className="text-gray-400 hover:text-indigo-600 text-sm flex items-center gap-1"
          >
            + Add Heading
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;