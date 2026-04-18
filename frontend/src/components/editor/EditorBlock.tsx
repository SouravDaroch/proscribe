import React from 'react';
import { type UseFormRegister } from 'react-hook-form';
import { type PostFormInputs } from '../../../../shared/schema/validation.js';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorBlockProps {
  id: string;
  index: number;
  type: 'heading' | 'text' | 'code';
  register: UseFormRegister<PostFormInputs>;
  onRemove: () => void;
  error?: any;
}

const EditorBlock: React.FC<EditorBlockProps> = ({ id, index, type, register, onRemove, error }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' as const : undefined,
  };

  const baseStyles = "w-full border-none outline-none focus:ring-0 p-0 resize-none bg-transparent placeholder-gray-300";

  return (
    <div ref={setNodeRef} style={style} className={`group relative flex items-start py-3 px-2 -mx-2 rounded-xl transition-colors ${isDragging ? 'shadow-lg bg-gray-50 opacity-90' : 'hover:bg-gray-50'}`}>
      
      {/* Block Controls (Shows on hover, positioned in the left margin) */}
      <div className={`absolute top-3 -left-16 w-16 transition-opacity flex items-center justify-end pr-1 gap-0.5 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div {...attributes} {...listeners} className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-600 transition-colors" title="Drag to reorder">
          <GripVertical className="w-5 h-5 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
          title="Delete block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 w-full">
        {type === 'heading' && (
          <input
            {...register(`blocks.${index}.content`)}
            placeholder="Heading..."
            className={`${baseStyles} text-2xl font-bold text-gray-900 leading-snug`}
          />
        )}

        {type === 'text' && (
          <AutoResizeTextarea register={register} index={index} baseStyles={baseStyles} />
        )}
        
        {/* Code block */}
        {type === 'code' && (
          <div className="bg-gray-900 p-6 rounded-xl font-mono text-sm shadow-inner mt-2">
            <AutoResizeTextarea
              register={register}
              index={index}
              baseStyles={`${baseStyles} font-mono text-emerald-400 placeholder-gray-600`}
              placeholder="// Write some code..."
              minRows={3}
            />
          </div>
        )}

        {error && (
            <p className="text-red-500 text-xs font-semibold mt-2">
                {error.message}
            </p>
        )}
      </div>
    </div>
  );
};

export default EditorBlock;

// ─── AutoResizeTextarea ──────────────────────────────────────────────────────
// Each block owns its own ref + resize lifecycle.
// - useEffect triggers resize on mount (handles pre-loaded/pasted content)
// - onChange: calls RHF's onChange first (validation sync), then resizes the element

interface AutoResizeTextareaProps {
  register: UseFormRegister<PostFormInputs>;
  index: number;
  baseStyles: string;
  placeholder?: string;
  minRows?: number;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  register,
  index,
  baseStyles,
  placeholder = 'Write something...',
  minRows = 1,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Trigger resize on mount — fixes pasted/pre-filled content not auto-sizing
  React.useEffect(() => {
    if (textareaRef.current) resize(textareaRef.current);
  }, []);

  const { ref: registerRef, onChange: rhfOnChange, ...rest } = register(`blocks.${index}.content`);

  return (
    <textarea
      {...rest}
      ref={(el) => {
        registerRef(el);       // keep RHF's internal ref working
        textareaRef.current = el; // keep our local resize ref working
      }}
      placeholder={placeholder}
      rows={minRows}
      className={`${baseStyles} text-lg leading-relaxed`}
      onChange={(e) => {
        rhfOnChange(e);   // RHF onChange first — validation stays perfectly in sync
        resize(e.target); // then expand the height
      }}
    />
  );
};