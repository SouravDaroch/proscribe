import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/register', data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcff] p-4">
      <div className="flex w-full max-w-4xl h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Left Side (Same Branding) */}
        <div className="hidden md:flex md:w-1/2 bg-violet-600 p-12 flex-col justify-between text-white">
          <h1 className="text-4xl font-bold">ProScribe.</h1>
          <p className="text-violet-100 text-lg">Join the elite circle of technical writers.</p>
          <div className="text-sm text-violet-200">© 2026 ProScribe</div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input 
              {...register('name', { required: true })} 
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500" 
              placeholder="Full Name" 
            />
            <input 
              {...register('email', { required: true })} 
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500" 
              placeholder="Email" 
            />
            <input 
              type="password" 
              {...register('password', { required: true, minLength: 6 })} 
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500" 
              placeholder="Password" 
            />
            <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg">
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-violet-600 font-bold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;