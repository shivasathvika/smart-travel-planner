import mongoose from 'mongoose';

const travelPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    mood: String,
    budget: {
        type: Number,
        required: true
    },
    itinerary: [{
        day: Number,
        activities: [{
            time: String,
            activity: String,
            location: String,
            cost: Number
        }]
    }],
    totalCost: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('TravelPlan', travelPlanSchema);
