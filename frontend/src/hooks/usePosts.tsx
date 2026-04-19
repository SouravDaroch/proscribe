import { useState, useEffect } from 'react';
import api from '../api/axios'; // Use the configured instance with baseURL & credentials

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts'); // baseURL is already 'http://localhost:5000/api'
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return { posts, loading, error };
};