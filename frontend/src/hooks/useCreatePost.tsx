// hooks/useCreatePost.ts
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostFormInputs } from '../../../shared/schema/validation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const form = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
    mode: 'onTouched', // Validates as they type/leave fields
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

  const onSubmit = async (data: PostFormInputs) => {
    setIsPublishing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts', data, {
        withCredentials: true,
      });
      if (response.status === 201) navigate('/dashboard');
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