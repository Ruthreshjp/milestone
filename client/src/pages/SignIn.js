import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('SignIn: Checking token validity');
      api.get('https://milestone-2-94o5.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          console.log('SignIn: Token valid, redirecting to /home');
          navigate('/home');
        })
        .catch((err) => {
          console.error('SignIn: Token validation failed:', err.message);
          localStorage.removeItem('token');
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('SignIn: Sending request to /signin');
      const res = await api.post('https://milestone-2-94o5.onrender.com/api/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      console.log('SignIn: Sign-in successful, redirecting to /home');
      navigate('/home');
    } catch (err) {
      console.error('SignIn: Error during sign-in:', err.message);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded">
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')} className="text-white-400">
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default SignIn;