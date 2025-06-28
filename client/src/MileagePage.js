import React from 'react';
import Navbar from '../components/Navbar';
import MileageCalculator from '../components/MileageCalculator';

function MileagePage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <MileageCalculator />
      </div>
    </div>
  );
}

export default MileagePage;