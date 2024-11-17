import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    avatar: String,
    phoneNumber: String,
    preferences: {
        preferredCurrency: {
            type: String,
            default: 'USD'
        },
        preferredLanguage: {
            type: String,
            default: 'en'
        },
        travelPreferences: {
            preferredAccommodationType: String,
            dietaryRestrictions: [String],
            activityPreferences: [String],
            budgetRange: {
                min: Number,
                max: Number
            }
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            tripReminders: {
                type: Boolean,
                default: true
            }
        }
    },
    reviews: [{
        placeId: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    savedPlaces: [{
        placeId: String,
        name: String,
        category: String,
        notes: String
    }]
}, {
    timestamps: true
});

export default mongoose.model('Profile', profileSchema);
