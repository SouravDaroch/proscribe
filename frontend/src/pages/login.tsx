import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setServerError('');
            const response = await api.post('/auth/login', data);

            // Use the global login function from Context
            login(response.data, response.data.token);

            // Redirect to dashboard (we'll build this next)
            navigate('/dashboard');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Something went wrong');
        }
    };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]">
    {/* Main Container */}
    <div className="flex w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 m-4">
      
      {/* Left Side: Branding/Visual (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-violet-600 p-12 flex-col justify-between text-white">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">ProScribe.</h1>
          <p className="mt-4 text-violet-100 text-lg">
            Where professional writing meets seamless engineering.
          </p>
        </div>
        <div className="text-sm text-violet-200">
          © 2026 ProScribe Internal Tooling
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md text-sm animate-pulse">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200"
              placeholder="name@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message as string}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-500 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
              Remember me
            </label>
            <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-[0.99]"
          >
            Sign In to Dashboard
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-400">
          Not a member? <span className="text-violet-600 font-medium cursor-pointer">Contact Admin</span>
        </p>
      </div>
    </div>
  </div>
);
};

export default Login;