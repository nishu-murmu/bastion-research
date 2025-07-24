import React, { useState } from 'react';
import { supabase } from './supabase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium"
          >
            Login
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
