import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
// Import your existing Editor component
import EditorBlock from '../components/editor/EditorBlock'; 

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setInitialData(data);
      } catch (err) {
        console.error("Failed to load post for editing");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (updatedData: any) => {
    try {
      await api.put(`/posts/${id}`, updatedData);
      alert("Post updated successfully!");
      navigate(`/post/${id}`); // Redirect back to the view page
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading Editor...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      {/* Pass the initialData to your editor. 
         Your editor component needs to handle 'defaultValues'.
      */}
      <EditorBlock 
        initialData={initialData} 
        onSubmit={handleUpdate} 
        buttonText="Update Article" 
      />
    </div>
  );
};

export default EditPost;