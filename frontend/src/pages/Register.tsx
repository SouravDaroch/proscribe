import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormInputs } from '../../../shared/schema/validation';

const Register = () => {
    // Attaching the resolver and the Type to the form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormInputs>({
      resolver: zodResolver(registerSchema)
    });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setServerError('');
      await api.post('/auth/register', data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcff] p-4">
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-4xl h-162.5 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 m-4"
      >

        {/* Left Side: Branding/Visual (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-sky-500 to-violet-600 p-12 flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">ProScribe.</h1>
            <p className="mt-4 text-violet-100 text-lg">
              Join the elite circle of technical writers.
            </p>
          </div>
          <div className="text-sm text-violet-200">
            © 2026 ProScribe Internal Tooling
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Enter your details to join us today</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md text-sm animate-pulse">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message as string}</p>}
            </div>

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

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-[0.99] mt-2"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-violet-600 font-medium cursor-pointer hover:text-violet-700">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;