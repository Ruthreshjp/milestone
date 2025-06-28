import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="container mx-auto p-6 max-w-md text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Milestone</h1>
      <p className="mb-6">Please sign in or sign up to continue.</p>
      <button
        onClick={handleSignIn}
        className="w-full py-2 mb-4 bg-blue-500 text-white rounded"
      >
        Sign In
      </button>
      <button
        onClick={handleSignUp}
        className="w-full py-2 bg-green-500 text-white rounded"
      >
        Sign Up
      </button>
    </div>
  );
}

export default LandingPage;