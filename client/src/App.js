import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/HomePage';
import Mileage from './pages/MileageCalculator';
import Fuel from './pages/FuelEstimator';
import TripBook from './pages/TripBook';
import History from './pages/History';
import AccountLog from './pages/AccountLog';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mileage" element={<Mileage />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/trip" element={<TripBook />} />
        <Route path="/history" element={<History />} />
        <Route path="/accountlog" element={<AccountLog />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;