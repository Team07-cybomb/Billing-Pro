// routes/settings.js
import express from 'express';
import Settings from '../models/Settings.js'; 
import { auth, authorize } from '../middleware/auth.js'; 

const router = express.Router();

// Middleware to ensure only authenticated Admins can access all settings routes
router.use(auth); 
router.use(authorize('admin')); 

// GET /api/settings
// Fetch the single global settings document. USES UPSERT TO ENSURE IT EXISTS.
router.get('/', async (req, res) => {
    try {
        // Find the global settings document or create it if it doesn't exist
        const settings = await Settings.findOneAndUpdate(
            { settingsId: 'global_settings' },
            {}, // No updates needed, just find or create
            { upsert: true, new: true, runValidators: true } 
        );

        // Destructure to remove MongoDB IDs and internal fields from the response
        const { _id, settingsId, __v, createdAt, ...settingsData } = settings.toObject();

        res.json(settingsData);
    } catch (error) {
        console.error('Error fetching global settings:', error);
        res.status(500).json({ message: 'Failed to retrieve settings.', error: error.message });
    }
});

// PATCH /api/settings/:category
// Update a specific category of settings (company, preferences, or payment)
router.patch('/:category', async (req, res) => {
    const { category } = req.params;
    const updates = req.body;

    const allowedCategories = ['company', 'preferences', 'payment'];

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid settings category: ${category}` });
    }

    try {
        // Construct the update object to target the nested field 
        const updateObject = {};
        for (const key in updates) {
            updateObject[`${category}.${key}`] = updates[key];
        }

        const settings = await Settings.findOneAndUpdate(
            { settingsId: 'global_settings' },
            { $set: updateObject, updatedAt: new Date() },
            // FIX: Added upsert: true to create the document if it doesn't exist
            { new: true, runValidators: true, useFindAndModify: false, upsert: true } 
        );
        
        // With upsert: true, this check should now be unreachable unless Mongoose failed catastrophically.
        if (!settings) {
            // Re-sending 500 status since 404 is technically wrong if we intend to create it.
            return res.status(500).json({ message: 'Failed to create or update global settings document.' });
        }

        // Return only the updated category data
        res.json({ message: `${category} settings updated successfully.`, data: settings[category] });

    } catch (error) {
        console.error(`Error updating ${category} settings:`, error);
        res.status(500).json({ message: `Failed to update ${category} settings.`, error: error.message });
    }
});

export default router;
