import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function History() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [historyType, setHistoryType] = useState('Trip');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleView = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please sign in again.');
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    if (!vehicleNo) {
      setError('Vehicle number is required');
      return;
    }

    try {
      const res = await api.get('https://milestone-2-94o5.onrender.com/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Raw history data:', res.data);
      const filteredHistory = res.data.filter(entry =>
        entry.details.toLowerCase().includes(vehicleNo.toLowerCase()) && entry.type === historyType
      );
      console.log('Filtered history:', filteredHistory);
      setHistory(filteredHistory);
      setError('');
    } catch (err) {
      setError('Error fetching history: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">History</h1>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="vehicleNo" className="block font-medium mb-2">Vehicle No</label>
          <input
            type="text"
            id="vehicleNo"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="w-full p-2"
            placeholder="e.g., TN34AB1234"
          />
        </div>
        <div>
          <label htmlFor="historyType" className="block font-medium mb-2">History Type</label>
          <select
            id="historyType"
            value={historyType}
            onChange={(e) => setHistoryType(e.target.value)}
            className="w-full p-2 bg-gray-700"
          >
            <option value="Trip">Trip</option>
            <option value="Mileage">Mileage</option>
          </select>
        </div>
        <button onClick={handleView} className="w-full py-2 bg-blue-500 text-white rounded">View History</button>
        {history.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mt-4">History</h2>
            <table className="w-full mt-2 border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index} className="bg-gray-800">
                    <td className="border p-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="border p-2">{entry.type}</td>
                    <td className="border p-2">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;