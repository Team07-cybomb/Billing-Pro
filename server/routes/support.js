// routes/support.js
import express from 'express';
import SupportTicket from '../models/SupportTicket.js'; // Adjust path as needed
import { auth } from '../middleware/auth.js'; // Assuming you use auth middleware

const router = express.Router();

// POST /api/support/tickets - Submit a new support ticket
router.post('/tickets', auth, async (req, res) => {
    try {
        const { name, email, subject, department, message } = req.body;
        
        const newTicket = new SupportTicket({
            customerName: name,
            customerEmail: email,
            subject,
            department,
            message,
            submittedBy: req.user.id // Link the ticket to the submitting user/staff ID
        });

        const savedTicket = await newTicket.save();
        
        console.log(`[TICKET CREATED] ID: ${savedTicket.ticketId} | Subject: ${subject} | User: ${req.user.username}`);

        res.status(201).json({ 
            message: 'Ticket submitted successfully.', 
            ticketId: savedTicket.ticketId,
            savedTicket
        });
    } catch (error) {
        console.error('Error submitting support ticket:', error);
        // Mongoose validation or other errors
        res.status(400).json({ message: 'Failed to submit ticket.', error: error.message });
    }
});

// GET /api/support/tickets - Fetch tickets (used by Admin/SupportData page)
router.get('/tickets', auth, async (req, res) => {
    try {
        // NOTE: This logic ensures staff only see tickets they submitted
        let filter = {};
        // If the user is staff, filter by their ID
        if (req.user.role === 'staff') {
            filter.submittedBy = req.user.id;
        }
        
        // Admins (or users without a role check here) see all tickets
        // If you want stricter admin-only access, add that check here.

        const tickets = await SupportTicket.find(filter)
                                   .populate('submittedBy', 'username role') // Optional: populate submitter info
                                   .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        res.status(500).json({ message: 'Failed to retrieve tickets.' });
    }
});

export default router;