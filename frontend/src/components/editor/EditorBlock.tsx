import React from 'react';
import { type  UseFormRegister } from 'react-hook-form';
import {type PostFormInputs } from '../../../../shared/schema/validation.js'; // Using your new shared path!

interface EditorBlockProps {
  index: number;
  type: 'heading' | 'text' | 'code';
  register: UseFormRegister<PostFormInputs>;
  onRemove: () => void;
}

const EditorBlock: React.FC<EditorBlockProps> = ({ index, type, register, onRemove }) => {
  // Common styling for all blocks
  const baseStyles = "w-full border-none outline-none focus:ring-0 p-0 resize-none bg-transparent";

  return (
    <div className="group relative flex items-start gap-3 py-2">
      {/* Delete button: Only shows on hover */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -left-8 top-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
        title="Delete block"
      >
        ✕
      </button>

      <div className="flex-1">
        {type === 'heading' && (
          <input
            {...register(`blocks.${index}.content`)}
            placeholder="Heading 1"
            className={`${baseStyles} text-2xl font-semibold text-gray-900`}
          />
        )}

        {type === 'text' && (
          <textarea
            {...register(`blocks.${index}.content`)}
            placeholder="Type '/' for commands..."
            className={`${baseStyles} text-lg text-gray-700 min-h-6`}
            rows={1}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
            }}
          />
        )}
        
        {/* Placeholder for future 'code' block */}
        {type === 'code' && (
          <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
            <textarea 
               {...register(`blocks.${index}.content`)}
               placeholder="// Write some code..."
               className={`${baseStyles} font-mono`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorBlock;