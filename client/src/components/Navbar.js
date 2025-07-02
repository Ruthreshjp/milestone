import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/signin');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo on the left */}
        <span className="text-2xl font-bold text-blue-400">Milestone</span>

        {/* Mobile menu button on the right */}
        <div className="sm:hidden">
          <button
            className="text-white text-3xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Dropdown menu for mobile */}
          <div
            className={`${
              isOpen ? 'flex' : 'hidden'
            } flex-col gap-2 absolute top-14 right-0 bg-gray-900 p-4 w-[160px] rounded-md shadow-lg z-50`}
          >
            {token ? (
              <>
                <button onClick={() => handleNavClick('/home')} className="text-left text-gray-300 hover:text-blue-400">
                  Home
                </button>
                <button onClick={() => handleNavClick('/mileage')} className="text-left text-gray-300 hover:text-blue-400">
                  Mileage
                </button>
                <button onClick={() => handleNavClick('/fuel')} className="text-left text-gray-300 hover:text-blue-400">
                  Fuel Estimator
                </button>
                <button onClick={() => handleNavClick('/trip')} className="text-left text-gray-300 hover:text-blue-400">
                  Trip Book
                </button>
                <button onClick={() => handleNavClick('/history')} className="text-left text-gray-300 hover:text-blue-400">
                  History
                </button>
                <button onClick={() => handleNavClick('/accountlog')} className="text-left text-gray-300 hover:text-blue-400">
                  Account Log
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('/signin')} className="text-left text-gray-300 hover:text-blue-400">
                  Sign In
                </button>
                <button onClick={() => handleNavClick('/signup')} className="text-left text-gray-300 hover:text-blue-400">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex gap-6 items-center">
          {token ? (
            <>
              <Link to="/home" className="text-gray-300 hover:text-blue-400">Home</Link>
              <Link to="/mileage" className="text-gray-300 hover:text-blue-400">Mileage</Link>
              <Link to="/fuel" className="text-gray-300 hover:text-blue-400">Fuel Estimator</Link>
              <Link to="/trip" className="text-gray-300 hover:text-blue-400">Trip Book</Link>
              <Link to="/history" className="text-gray-300 hover:text-blue-400">History</Link>
              <Link to="/accountlog" className="text-gray-300 hover:text-blue-400">Account Log</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-300 hover:text-blue-400">Sign In</Link>
              <Link to="/signup" className="text-gray-300 hover:text-blue-400">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
