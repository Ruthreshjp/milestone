import React, { useState } from 'react'; // Removed useEffect since we no longer fetch profile
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Keep for other potential uses

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [username, setUsername] = useState('User'); // Default to 'User'

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Navbar: User logged out, redirecting to /signin');
    navigate('/signin');
  };

  return (
    <nav className="p-4 bg-gray-900 bg-opacity-90 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-400">Milestone</span>
        <div className="flex items-center space-x-6">
          {token ? (
            <>
              <Link to="/home" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Home</Link>
              <Link to="/mileage" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Mileage</Link>
              <Link to="/fuel" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Fuel Estimator</Link>
              <Link to="/trip" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Trip Book</Link>
              <Link to="/history" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">History</Link>
              <Link to="/accountlog" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Account Log</Link>
              {/* Removed <Link to="/profile" ...> */}
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Sign In</Link>
              <Link to="/signup" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;