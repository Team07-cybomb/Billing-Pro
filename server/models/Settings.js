// models/Settings.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Store all settings in one document (ID is usually hardcoded in backend logic, e.g., 'global_settings_id')
    settingsId: {
        type: String,
        required: true,
        unique: true,
        default: 'global_settings'
    },

    // --- Company Info (Handled by frontend path /company) ---
    company: {
        name: { type: String, default: 'Billing Pro Business Suite' },
        email: { type: String, default: 'contact@billingpro.com' },
        phone: { type: String, default: '+1 (555) 123-4567' },
        address: { type: String, default: '123 Business Way, Suite 100, City, State, 12345' },
        logo: { type: String } // URL or path to logo
    },

    // --- System Preferences (Handled by frontend path /preferences) ---
    preferences: {
        operationalHours: { type: String, default: '9:00 - 17:00' },
        enable2FA: { type: Boolean, default: false },
        enableMaintenanceMode: { type: Boolean, default: false }
    },

    // --- Payment Settings (Handled by frontend path /payment - Logic will be simple placeholders) ---
    payment: {
        bankName: { type: String },
        accountNumber: { type: String },
        ifsc: { type: String },
        paypalEmail: { type: String }
    },
    
    // --- Metadata ---
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensures that we only ever attempt to create one settings document
settingsSchema.pre('save', function (next) {
    if (this.isNew && this.settingsId !== 'global_settings') {
        const error = new Error('Only one settings document is allowed.');
        next(error);
    } else {
        next();
    }
});


export default mongoose.model('Settings', settingsSchema);
