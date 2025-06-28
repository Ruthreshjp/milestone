import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // axios instance

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('driver');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('SignUp: Checking token validity');
      api.get('https://milestone-2-94o5.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          console.log('SignUp: Token valid, redirecting to /home');
          navigate('/home');
        })
        .catch((err) => {
          console.error('SignUp: Token validation failed:', err.message);
          localStorage.removeItem('token');
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting signup with:', { email, username, userType, password });
    try {
      console.log('SignUp: Sending request to /api/signup', { email, username, userType, password });
      await api.post('https://milestone-2-94o5.onrender.com/api/signup', {
        email,
        username,
        userType,
        password,
      });
      setError('');
      console.log('SignUp: Sign-up successful, redirecting to /signin');
      navigate('/signin');
    } catch (err) {
      console.error('SignUp: Error during sign-up:', err.message, err.response?.data);
      setError('Error signing up: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
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
          <label className="block font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">User Type</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          >
            <option value="admin">Owner</option>
            <option value="driver">Driver</option>
          </select>
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
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <button onClick={() => navigate('/signin')} className="text-white-400 underline">
          Sign In
        </button>
      </p>
    </div>
  );
}

export default SignUp;
