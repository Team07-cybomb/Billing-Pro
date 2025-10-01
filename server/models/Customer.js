import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  taxId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customer', customerSchema);