
// models/SupportTicket.js
import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['technical', 'billing', 'feature', 'account']
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
    // Track the staff user who submitted the ticket (if internal)
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate Ticket ID before saving
supportTicketSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const count = await mongoose.model('SupportTicket').countDocuments();
            this.ticketId = `TKT-${String(count + 1).padStart(5, '0')}`;
        } catch (error) {
            this.ticketId = `TKT-${Date.now().toString().slice(-6)}`;
        }
    }
    next();
});

export default mongoose.model('SupportTicket', supportTicketSchema);
