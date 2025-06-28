require('dotenv').config(); // Ensure this is at the top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (from db.js)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/milestone_project', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Models (from Models.js)
// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['admin', 'driver'], required: true },
  password: { type: String, required: true },
});

// AccountLog Schema
const accountLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNo: { type: String, required: true },
  reason: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Mileage Schema
const mileageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNo: { type: String, required: true },
  initialKm: { type: Number, required: true },
  finalKm: { type: Number, required: true },
  distance: { type: Number, required: true },
  fuelUsed: { type: Number, required: true },
  mileage: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Trip Schema
const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNo: { type: String, required: true },
  initialKm: { type: Number, required: true },
  finalKm: { type: Number, required: true },
  pricePerKm: { type: Number, required: true },
  kmDriven: { type: Number, required: true },
  totalCharges: { type: Number, required: true },
  time: { type: Date, required: true },
});

// Expense Schema
const expenseSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  reason: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// Define Models
const User = mongoose.model('User', userSchema);
const AccountLog = mongoose.model('AccountLog', accountLogSchema);
const Mileage = mongoose.model('Mileage', mileageSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Expense = mongoose.model('Expense', expenseSchema);

// Authentication Middleware (from auth.js)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token);
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes (from Routes.js)
const router = express.Router();

// User Routes
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  const { email, username, userType, password } = req.body;

  if (!email || !username || !userType || !password) {
    return res.status(400).json({ message: 'Email, username, user type, and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    let mappedUserType = userType.toLowerCase();
    if (mappedUserType === 'owner') mappedUserType = 'admin';
    else if (mappedUserType === 'driver') mappedUserType = 'driver';

    user = new User({
      email,
      username,
      userType: mappedUserType,
      password: await bcrypt.hash(password, 10),
    });

    await user.validate();
    await user.save();
    console.log('User saved successfully:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error details:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message, details: err.errors });
    }
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  console.log('Received signin request:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ message: 'Server error during signin', error: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  console.log('Fetching profile for user:', req.user);
  try {
    const user = await User.findById(req.user.id).select('username -_id').lean();
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User data fetched from DB:', user);
    res.json(user);
  } catch (err) {
    console.error('Detailed error fetching profile:', err);
    res.status(500).json({ message: 'Server error while fetching profile', error: err.message });
  }
});

// AccountLog Routes
router.post('/accountlog', auth, async (req, res) => {
  console.log('Received account log data:', req.body);
  console.log('User from auth:', req.user);

  const { vehicleNo, reason, cost } = req.body;

  if (!vehicleNo || !reason || !cost) {
    return res.status(400).json({ message: 'Vehicle number, reason, and cost are required' });
  }

  const costNum = parseFloat(cost);
  if (isNaN(costNum) || costNum <= 0) {
    return res.status(400).json({ message: 'Cost must be a positive number' });
  }

  try {
    const newLog = new AccountLog({
      user: req.user.id,
      vehicleNo,
      reason,
      cost: costNum,
      date: new Date(),
    });
    console.log('Account log to save:', newLog);
    await newLog.save();
    res.json({ message: 'Expense saved successfully' });
  } catch (err) {
    console.error('Detailed error adding expense:', err);
    res.status(500).json({ message: 'Server error while adding expense', error: err.message });
  }
});

router.get('/accountlog', auth, async (req, res) => {
  console.log('Fetching account logs for user:', req.user);
  try {
    const logs = await AccountLog.find({ user: req.user.id }).select('vehicleNo reason cost date -_id').lean();
    console.log('Fetched account logs:', logs);
    res.json(logs);
  } catch (err) {
    console.error('Detailed error fetching account logs:', err);
    res.status(500).json({ message: 'Server error while fetching account logs', error: err.message });
  }
});

router.get('/accountlog/summary', auth, async (req, res) => {
  console.log('Fetching account log summary for user:', req.user);
  const { period = 'monthly' } = req.query; // Default to monthly, can be 'monthly' or 'yearly'
  const now = new Date();
  let startDate;

  if (period === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
  } else if (period === 'yearly') {
    startDate = new Date(now.getFullYear(), 0, 1); // Start of current year
  } else {
    return res.status(400).json({ message: 'Invalid period. Use "monthly" or "yearly"' });
  }

  try {
    // Fetch expenses from AccountLog
    const expenses = await AccountLog.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).select('cost date -_id').lean();
    const totalExpense = expenses.reduce((sum, log) => sum + log.cost, 0);

    // Fetch income from Trip (totalCharges as income)
    const trips = await Trip.find({
      user: req.user.id,
      time: { $gte: startDate }
    }).select('totalCharges time -_id').lean();
    const totalIncome = trips.reduce((sum, trip) => sum + trip.totalCharges, 0);

    // Calculate profit/loss
    const profitLoss = totalIncome - totalExpense;

    // Prepare detailed logs for display
    const detailedLogs = [
      ...expenses.map(log => ({
        date: log.date,
        type: 'Expense',
        details: `Cost: ₹${log.cost.toFixed(2)} on ${new Date(log.date).toLocaleDateString()}`,
      })),
      ...trips.map(trip => ({
        date: trip.time,
        type: 'Income',
        details: `Trip Income: ₹${trip.totalCharges.toFixed(2)} on ${new Date(trip.time).toLocaleDateString()}`,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      logs: detailedLogs,
      summary: {
        totalExpense: totalExpense.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
      },
    });
  } catch (err) {
    console.error('Detailed error fetching account log summary:', err);
    res.status(500).json({ message: 'Server error while fetching account log summary', error: err.message });
  }
});

// Trip Routes
router.post('/trip', auth, async (req, res) => {
  console.log('Received trip data:', req.body);
  console.log('User from auth:', req.user);

  const { vehicleNo, initialKm, finalKm, pricePerKm, kmDriven, totalCharges, time } = req.body;

  if (!vehicleNo || !initialKm || !finalKm || !pricePerKm || !kmDriven || !totalCharges || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (
    typeof initialKm !== 'number' || initialKm < 0 ||
    typeof finalKm !== 'number' || finalKm < 0 ||
    typeof pricePerKm !== 'number' || pricePerKm <= 0 ||
    typeof kmDriven !== 'number' || kmDriven < 0 ||
    typeof totalCharges !== 'number' || totalCharges < 0
  ) {
    return res.status(400).json({ message: 'Numeric fields must be positive (pricePerKm must be greater than 0)' });
  }

  try {
    const newTrip = new Trip({
      user: req.user.id,
      vehicleNo,
      initialKm,
      finalKm,
      pricePerKm,
      kmDriven,
      totalCharges,
      time: new Date(time),
    });
    console.log('Trip object to save:', newTrip);
    await newTrip.save();
    res.json({ message: 'Trip data saved successfully' });
  } catch (err) {
    console.error('Detailed error saving trip:', err);
    res.status(500).json({ message: 'Server error while saving trip data', error: err.message });
  }
});

// Mileage Routes
router.post('/mileage', auth, async (req, res) => {
  console.log('Received mileage data:', req.body);
  console.log('User from auth:', req.user);

  const { vehicleNo, initialKm, finalKm, distance, fuelUsed, mileage, date } = req.body;

  if (!vehicleNo || !date || initialKm == null || finalKm == null || distance == null || fuelUsed == null || mileage == null) {
    return

 res.status(400).json({ message: 'All fields are required' });
  }

  if (typeof initialKm !== 'number' || typeof finalKm !== 'number' || typeof distance !== 'number' || typeof fuelUsed !== 'number' || typeof mileage !== 'number') {
    return res.status(400).json({ message: 'Numeric fields must be numbers' });
  }

  if (initialKm < 0 || finalKm < 0 || distance < 0 || fuelUsed <= 0 || mileage <= 0) {
    return res.status(400).json({ message: 'Numeric fields must be positive (fuelUsed and mileage must be greater than 0)' });
  }

  try {
    const newMileage = new Mileage({
      user: req.user.id,
      vehicleNo,
      initialKm,
      finalKm,
      distance,
      fuelUsed,
      mileage,
      date: new Date(date),
    });
    console.log('Mileage object to save:', newMileage);
    await newMileage.save();
    res.json({ message: 'Mileage data saved successfully' });
  } catch (err) {
    console.error('Detailed error saving mileage:', err);
    res.status(500).json({ message: 'Server error while saving mileage data', error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  console.log('Accessing /history route');
  console.log('User from auth:', req.user);
  try {
    const mileage = await Mileage.find({ user: req.user.id }).select('vehicleNo date distance fuelUsed mileage -_id').lean();
    const trips = await Trip.find({ user: req.user.id }).select('vehicleNo time initialKm finalKm kmDriven totalCharges -_id').lean();

    const history = [
      ...mileage.map(entry => ({
        date: entry.date,
        type: 'Mileage',
        details: `Vehicle: ${entry.vehicleNo}, Distance: ${entry.distance} km, Fuel: ${entry.fuelUsed} L, Mileage: ${entry.mileage} km/L`,
      })),
      ...trips.map(entry => ({
        date: entry.time,
        type: 'Trip',
        details: `Vehicle: ${entry.vehicleNo}, Initial KM: ${entry.initialKm}, Final KM: ${entry.finalKm}, Distance: ${entry.kmDriven} km, Total Amount: ₹${entry.totalCharges}`,
      })),
    ];

    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('History data to send:', history);

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error while fetching history', error: err.message });
  }
});

// Mount Routes
app.use('/api', router);

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();