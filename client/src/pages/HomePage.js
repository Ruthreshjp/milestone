import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div
      className="container mx-auto p-6 max-h-screen bg-cover bg-center bg-fixed "
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <header className="text-white text-center py-10">
        <h1 className="text-4xl font-bold mb-4 text-shadow-md">Welcome to Milestone</h1>
        <p className="text-shadow font-bold max-w-2xl mx-auto">
          Milestone is your all-in-one vehicle management solution. Track your mileage, estimate fuel costs, and log your trips with ease. Whether you're a driver or a fleet owner, our tools help you stay organized and in control.
        </p>
      </header>
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg text-white text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Milestone</h2>
          <p className="mb-6">Explore the features below to manage your vehicle data.</p>
          <div className="space-y-4">
            <Link to="/mileage" className="w-full block py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Mileage Calculator</Link>
            <Link to="/fuel" className="w-full block py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Fuel Estimator</Link>
            <Link to="/trip" className="w-full block py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Trip Book</Link>
          </div>
        </div>
      </div>
      <section className="py-10 text-white text-center">
        <h2 className="text-2xl font-bold mb-6 text-shadow-md">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4 bg-gray-700 bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold">Mileage Tracking</h3>
            <p>Monitor your vehicle's mileage with precision and maintain accurate records.</p>
          </div>
          <div className="p-4 bg-gray-700 bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold">Fuel Estimation</h3>
            <p>Calculate fuel costs and optimize your vehicle's efficiency.</p>
          </div>
          <div className="p-4 bg-gray-700 bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold">Trip Logging</h3>
            <p>Log your trips and analyze travel data effortlessly.</p>
          </div>
        </div>
      </section>
      <section className="py-10 text-white text-center">
        <h2 className="text-2xl font-bold mb-6 text-shadow-md">Why Choose Milestone?</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <p><strong>Accuracy:</strong> Detailed tracking for all your vehicle data.</p>
          <p><strong>Efficiency:</strong> Save time with automated calculations.</p>
          <p><strong>Accessibility:</strong> Access your data anytime, anywhere.</p>
        </div>
      </section>
      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-4 text-shadow-md">Get Started Today!</h2>
        <Link to="/mileage" className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600">Explore Features</Link>
      </section>
      <footer className="text-center text-gray-400 py-6">
        <p>© 2025 Milestone. All rights reserved.</p>
        <p>
          <a href="/contact" className="underline">Contact Us</a> |{' '}
          <a href="/support" className="underline">Support</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;