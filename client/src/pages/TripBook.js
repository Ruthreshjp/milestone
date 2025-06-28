import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function TripBook() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [initialKm, setInitialKm] = useState('');
  const [finalKm, setFinalKm] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [totalCharges, setTotalCharges] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCalculate = () => {
    const initialKmNum = parseFloat(initialKm);
    const finalKmNum = parseFloat(finalKm);
    const pricePerKmNum = parseFloat(pricePerKm);

    if (!vehicleNo || !initialKm || !finalKm || !pricePerKm) {
      setError('All input fields are required');
      return;
    }

    if (isNaN(initialKmNum) || initialKmNum < 0 || isNaN(finalKmNum) || finalKmNum < 0 || isNaN(pricePerKmNum) || pricePerKmNum <= 0) {
      setError('Numeric fields must be positive (pricePerKm must be greater than 0)');
      return;
    }

    if (finalKmNum <= initialKmNum) {
      setError('Final KM must be greater than Initial KM');
      return;
    }

    const calculatedKmDriven = finalKmNum - initialKmNum;
    const calculatedTotalCharges = calculatedKmDriven * pricePerKmNum;
    const currentTime = new Date().toISOString().slice(0, 16); // Format for datetime-local

    setKmDriven(calculatedKmDriven.toFixed(2));
    setTotalCharges(calculatedTotalCharges.toFixed(2));
    setTime(currentTime);
    setError('');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please sign in again.');
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    if (!vehicleNo || !initialKm || !finalKm || !pricePerKm || !kmDriven || !totalCharges || !time) {
      setError('Please calculate first');
      return;
    }

    try {
      await api.post('https://milestone-2-94o5.onrender.com/trip', {
        vehicleNo,
        initialKm: parseFloat(initialKm),
        finalKm: parseFloat(finalKm),
        pricePerKm: parseFloat(pricePerKm),
        kmDriven: parseFloat(kmDriven),
        totalCharges: parseFloat(totalCharges),
        time,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Trip data saved successfully!');
      setError('');
      setVehicleNo('');
      setInitialKm('');
      setFinalKm('');
      setPricePerKm('');
      setKmDriven('');
      setTotalCharges('');
      setTime('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error saving trip data: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Trip Book</h1>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-400 mb-4 text-center">{success}</p>}
      <form className="space-y-4">
        <div>
          <label htmlFor="vehicleNo" className="block font-medium mb-2">Vehicle No</label>
          <input
            type="text"
            id="vehicleNo"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            placeholder="e.g., TN34AB1234"
            className="w-full p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="initialKm" className="block font-medium mb-2">Initial KM</label>
          <input
            type="number"
            id="initialKm"
            value={initialKm}
            onChange={(e) => setInitialKm(e.target.value)}
            placeholder="e.g., 1000"
            className="w-full p-2"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="finalKm" className="block font-medium mb-2">Final KM</label>
          <input
            type="number"
            id="finalKm"
            value={finalKm}
            onChange={(e) => setFinalKm(e.target.value)}
            placeholder="e.g., 1500"
            className="w-full p-2"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="pricePerKm" className="block font-medium mb-2">Price Per KM (₹)</label>
          <input
            type="number"
            id="pricePerKm"
            value={pricePerKm}
            onChange={(e) => setPricePerKm(e.target.value)}
            placeholder="e.g., 5"
            className="w-full p-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="button" onClick={handleCalculate} className="w-full py-2 bg-blue-500 text-white rounded">
          Calculate
        </button>
        <div>
          <label htmlFor="kmDriven" className="block font-medium mb-2">KM Driven</label>
          <input
            type="number"
            id="kmDriven"
            value={kmDriven}
            readOnly
            className="w-full p-2 bg-gray-600"
          />
        </div>
        <div>
          <label htmlFor="totalCharges" className="block font-medium mb-2">Total Charges (₹)</label>
          <input
            type="number"
            id="totalCharges"
            value={totalCharges}
            readOnly
            className="w-full p-2 bg-gray-600"
          />
        </div>
        <div>
          <label htmlFor="time" className="block font-medium mb-2">Date & Time</label>
          <input
            type="datetime-local"
            id="time"
            value={time}
            readOnly
            className="w-full p-2 bg-gray-600"
          />
        </div>
        <button type="button" onClick={handleSave} className="w-full py-2 bg-green-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}

export default TripBook;