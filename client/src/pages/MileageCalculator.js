import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function MileageCalculator() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [initialKm, setInitialKm] = useState('');
  const [finalKm, setFinalKm] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');
  const [mileage, setMileage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const calculateMileage = () => {
    const initial = parseFloat(initialKm) || 0;
    const final = parseFloat(finalKm) || 0;
    const fuel = parseFloat(fuelUsed) || 0;

    if (!vehicleNo) {
      setError('Vehicle number is required');
      setMileage('');
      return;
    }
    if (initial < 0 || final < 0 || fuel <= 0) {
      setError('Initial KM, Final KM must be non-negative, and Fuel Used must be positive');
      setMileage('');
      return;
    }
    if (final < initial) {
      setError('Final KM must be greater than or equal to Initial KM');
      setMileage('');
      return;
    }

    const distance = final - initial;
    const mileagePerLiter = distance / fuel;
    setMileage(mileagePerLiter.toFixed(2));
    setError('');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please sign in again.');
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    if (!mileage) {
      setError('Please calculate mileage before saving');
      return;
    }

    const initial = parseFloat(initialKm);
    const final = parseFloat(finalKm);
    const fuel = parseFloat(fuelUsed);
    const distance = final - initial;

    if (!vehicleNo || isNaN(initial) || isNaN(final) || isNaN(fuel)) {
      setError('All fields must be filled with valid values');
      return;
    }

    const mileageData = {
      vehicleNo,
      initialKm: initial,
      finalKm: final,
      distance,
      fuelUsed: fuel,
      mileage: parseFloat(mileage),
      date: new Date().toISOString(),
    };

    try {
      await api.post('https://milestone-2-94o5.onrender.com/mileage', mileageData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Mileage data saved successfully!');
      setError('');
      setVehicleNo('');
      setInitialKm('');
      setFinalKm('');
      setFuelUsed('');
      setMileage('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error saving mileage: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Mileage Calculator</h1>
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
          <label htmlFor="initialKm" className="block font-medium mb-2">Initial KM Driven</label>
          <input
            type="number"
            id="initialKm"
            value={initialKm}
            onChange={(e) => setInitialKm(e.target.value)}
            placeholder="e.g., 1234"
            className="w-full p-2"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="finalKm" className="block font-medium mb-2">Final KM Driven</label>
          <input
            type="number"
            id="finalKm"
            value={finalKm}
            onChange={(e) => setFinalKm(e.target.value)}
            placeholder="e.g., 2234"
            className="w-full p-2"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="fuelUsed" className="block font-medium mb-2">Fuel Used (Liters)</label>
          <input
            type="number"
            id="fuelUsed"
            value={fuelUsed}
            onChange={(e) => setFuelUsed(e.target.value)}
            placeholder="e.g., 10"
            className="w-full p-2"
            min="0"
            step="0.01"
          />
        </div>
        <button type="button" onClick={calculateMileage} className="w-full py-2 bg-blue-500 text-white rounded">
          Calculate Mileage
        </button>
        {mileage && (
          <div>
            <label className="block font-medium mb-2">Mileage (KM/L)</label>
            <input
              type="text"
              value={mileage}
              readOnly
              className="w-full p-2 bg-gray-700"
              placeholder="Mileage will be displayed here"
            />
          </div>
        )}
        {mileage && (
          <button type="button" onClick={handleSave} className="w-full py-2 bg-green-500 text-white rounded">
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default MileageCalculator;