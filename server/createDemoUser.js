import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createDemoUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/billing_app');
    
    const demoUser = new User({
      username: 'admin',
      email: 'admin@billing.com',
      password: 'password',
      role: 'admin'
    });
    
    await demoUser.save();
    console.log('Demo user created:', demoUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo user:', error);
    process.exit(1);
  }
};

createDemoUser();