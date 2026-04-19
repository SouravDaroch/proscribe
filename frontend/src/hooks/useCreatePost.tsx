import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostFormInputs } from '../../../shared/schema/validation';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Accept initialData as an optional parameter
export const useCreatePost = (initialData?: any) => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const form = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      blocks: [{ type: 'text', content: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'blocks',
  });

  // ─── SYNC INITIAL DATA ───
  // When initialData is provided (Edit Mode), reset the form with existing values
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || '',
        blocks: initialData.blocks,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: PostFormInputs) => {
    setIsPublishing(true);
    try {
      // Determine if we are updating or creating
      const isEditing = !!initialData?._id;
      
      const response = isEditing 
        ? await api.put(`/posts/${initialData._id}`, data, { withCredentials: true })
        : await api.post('/posts', data, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        // If updating, navigate to the specific post view, else dashboard
        navigate(isEditing ? `/post/${initialData._id}` : '/dashboard');
      }
    } catch (error: any) {
      console.error('Error saving post:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsPublishing(false);
    }
  };

  return { 
    ...form, 
    fields, 
    append, 
    remove, 
    move,
    onSubmit, 
    navigate, 
    isPublishing 
  };
};