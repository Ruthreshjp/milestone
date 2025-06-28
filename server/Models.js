const mongoose = require('mongoose');

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

// Model exports
module.exports = {
  User: mongoose.model('User', userSchema),
  AccountLog: mongoose.model('AccountLog', accountLogSchema),
  Mileage: mongoose.model('Mileage', mileageSchema),
  Trip: mongoose.model('Trip', tripSchema),
  Expense: mongoose.model('Expense', expenseSchema),
};