import React, { useState } from 'react';

function FuelEstimator() {
  const [estimatedKms, setEstimatedKms] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [requiredFuel, setRequiredFuel] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [error, setError] = useState('');

  const calculateFuel = () => {
    const kms = parseFloat(estimatedKms) || 0;
    const mileagePerLiter = parseFloat(mileage) || 0;
    const price = parseFloat(fuelPrice) || 0;

    if (kms <= 0) {
      setError('Estimated KMs must be a positive number');
      setRequiredFuel('');
      setEstimatedCost('');
      return;
    }
    if (mileagePerLiter <= 0) {
      setError('Mileage must be a positive number');
      setRequiredFuel('');
      setEstimatedCost('');
      return;
    }

    const fuelNeeded = kms / mileagePerLiter;
    setRequiredFuel(fuelNeeded.toFixed(2));
    if (price > 0) {
      setEstimatedCost((fuelNeeded * price).toFixed(2));
    } else {
      setEstimatedCost('');
    }
    setError('');
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Fuel Estimator</h1>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="estimatedKms" className="block font-medium mb-2">Estimated KMs to Drive</label>
          <input
            type="number"
            id="estimatedKms"
            value={estimatedKms}
            onChange={(e) => setEstimatedKms(e.target.value)}
            placeholder="Enter estimated KMs"
          />
        </div>
        <div>
          <label htmlFor="mileage" className="block font-medium mb-2">Mileage of Your Vehicle (KM/L)</label>
          <input
            type="number"
            id="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter mileage"
          />
        </div>
        <div>
          <label htmlFor="fuelPrice" className="block font-medium mb-2">Price of Fuel (₹/L) (Optional)</label>
          <input
            type="number"
            id="fuelPrice"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder="Enter fuel price (optional)"
          />
        </div>
        <button type="button" onClick={calculateFuel}>
          Calculate Fuel
        </button>
        {requiredFuel && (
          <div>
            <label className="block font-medium mb-2">Required Fuel (Liters)</label>
            <input
              type="text"
              value={requiredFuel}
              readOnly
              className="bg-gray-700"
              placeholder="Click Calculate"
            />
          </div>
        )}
        {estimatedCost && (
          <div>
            <label className="block font-medium mb-2">Estimated Cost (₹)</label>
            <input
              type="text"
              value={estimatedCost}
              readOnly
              className="bg-gray-700"
              placeholder="Enter fuel price to calculate"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FuelEstimator;