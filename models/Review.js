import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    },
    images: [{
        url: String,
        caption: String
    }],
    visitDate: {
        type: Date,
        required: true
    },
    tripType: {
        type: String,
        enum: ['solo', 'couple', 'family', 'friends', 'business'],
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    categories: [{
        type: String,
        enum: ['accommodation', 'restaurant', 'attraction', 'transportation', 'activity']
    }],
    verified: {
        type: Boolean,
        default: false
    },
    reported: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating helpfulness score
reviewSchema.virtual('helpfulnessScore').get(function() {
    return this.helpful.length;
});

// Index for efficient querying
reviewSchema.index({ placeId: 1, rating: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Static method to get average rating for a place
reviewSchema.statics.getAverageRating = async function(placeId) {
    const result = await this.aggregate([
        { $match: { placeId: placeId } },
        {
            $group: {
                _id: '$placeId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    return result[0] || { averageRating: 0, totalReviews: 0 };
};

// Instance method to check if a review can be edited
reviewSchema.methods.canEdit = function(userId) {
    return this.userId.toString() === userId.toString() && 
           Date.now() - this.createdAt.getTime() < 24 * 60 * 60 * 1000; // 24 hours
};

// Middleware to handle pre-save operations
reviewSchema.pre('save', async function(next) {
    if (this.isModified('content')) {
        // Implement content moderation here if needed
        this.verified = false;
    }
    next();
});

export default mongoose.model('Review', reviewSchema);
