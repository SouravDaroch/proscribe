import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the structure of a single Block
interface IBlock {
  id?: string; // Client-side generated UUID
  type: 'heading' | 'text' | 'code';
  content: string;
  metadata?: {
    language?: string; // For code blocks (e.g., 'javascript')
    level?: number;    // For headings (e.g., 1, 2, 3)
  };
}

// 2. Define the Post interface
export interface IPost extends Document {
  title: string;
  description?: string;
  author: mongoose.Types.ObjectId;
  blocks: IBlock[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // The magic is here: an array of block objects
  blocks: [
    {
      id: { type: String, required: false },
      type: { type: String, enum: ['heading', 'text', 'code'], required: true },
      content: { type: String, required: true },
      metadata: { type: Object }
    }
  ],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });




const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;