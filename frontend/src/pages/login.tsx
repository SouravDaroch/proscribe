import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormInputs } from '../../../shared/schema/validation';
import { Layers } from 'lucide-react';

const Login = () => {
  // Attach the resolver and the Type
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setServerError('');
      const response = await api.post('/auth/login', data);
      // Use the global login function from Context
      login(response.data);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcff] p-4 md:p-0">
      {/* Mobile Branding */}
      <div className="md:hidden flex flex-col items-center text-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-100/30">
            <Layers className="text-white" size={20} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">ProScribe.</h1>
        </div>
        <p className="mt-3 text-gray-500 text-base px-4">
          Where professional writing meets seamless engineering.
        </p>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-4xl h-150 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 m-4"
      >

        {/* Left Side: Branding/Visual (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-sky-500 to-violet-600 p-12 flex-col justify-between text-white">
          <div>
          <div className="flex gap-2">  
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-violet-600  flex items-center justify-center shadow-md shadow-violet-100/30">
              <Layers className="text-white" size={20} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">ProScribe.</h1></div>
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
                {...register('email')}
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
                {...register('password')}
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
            Not a member? <Link to="/register" className="text-violet-600 font-medium cursor-pointer hover:text-violet-700">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;