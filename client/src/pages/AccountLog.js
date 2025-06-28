import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AccountLog() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [reason, setReason] = useState('');
  const [cost, setCost] = useState('');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [period, setPeriod] = useState('monthly'); // New state for period selection
  const [summary, setSummary] = useState({ totalExpense: 0, totalIncome: 0, profitLoss: 0 });
  const navigate = useNavigate();

  const handleAddExpense = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please sign in again.');
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    if (!vehicleNo || !reason || !cost) {
      setError('All fields are required');
      return;
    }

    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0) {
      setError('Cost must be a positive number');
      return;
    }

    try {
      await api.post('https://milestone-2-94o5.onrender.com/api/accountlog', { vehicleNo, reason, cost: costNum }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Expense added successfully!');
      setError('');
      setVehicleNo('');
      setReason('');
      setCost('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error adding expense: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  const handleViewLogs = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please sign in again.');
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    try {
      const res = await api.get('https://milestone-2-94o5.onrender.com/api/accountlog/summary', {
        headers: { Authorization: `Bearer ${token}` },
        params: { period },
      });
      setLogs(res.data.logs);
      setSummary(res.data.summary);
      setError('');
    } catch (err) {
      setError('Error fetching logs: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Account Log</h1>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-400 mb-4 text-center">{success}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="vehicleNo" className="block font-medium mb-2">Vehicle No</label>
          <input
            type="text"
            id="vehicleNo"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            placeholder="e.g., TN34AB1234"
            className="w-full p-2"
          />
        </div>
        <div>
          <label htmlFor="reason" className="block font-medium mb-2">Reason</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Oil change"
            className="w-full p-2"
          />
        </div>
        <div>
          <label htmlFor="cost" className="block font-medium mb-2">Cost (₹)</label>
          <input
            type="number"
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g., 500"
            className="w-full p-2"
            min="0"
            step="0.01"
          />
        </div>
        <button onClick={handleAddExpense} className="w-full py-2 bg-blue-500 text-white rounded">
          Add Expense
        </button>
        <div>
          <label htmlFor="period" className="block font-medium mb-2">View Period</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full p-2 bg-gray-700"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <button onClick={handleViewLogs} className="w-full py-2 bg-green-500 text-white rounded">
          View Logs
        </button>
        {logs.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mt-4">Account Logs</h2>
            <table className="w-full mt-2 border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="bg-gray-800">
                    <td className="border p-2">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="border p-2">{log.type}</td>
                    <td className="border p-2">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p>Total Expense: ₹{summary.totalExpense}</p>
              <p>Total Income: ₹{summary.totalIncome}</p>
              {parseFloat(summary.profitLoss) >= 0 ? (
                <p>Profit: ₹{summary.profitLoss}</p>
              ) : (
                <p>Loss: ₹{Math.abs(summary.profitLoss)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountLog;