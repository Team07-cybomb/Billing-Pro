// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // Import http module
import { initializeSocket } from './utils/notifier.js'; // Import the socket initializer

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import invoiceRoutes from './routes/invoices.js';
import inventoryRoutes from './routes/inventory.js';
import reportRoutes from './routes/reports.js';
import staffRoutes from './routes/stafflogs.js';
import settingsRoutes from './routes/settings.js';
import supportRoutes from './routes/support.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/billing_app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Initialize Socket.IO
initializeSocket(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stafflogs', staffRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/support', supportRoutes);

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Change app.listen to server.listen
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server: http://localhost:${PORT}/api/test`);
});