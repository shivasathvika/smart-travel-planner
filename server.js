import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';
import User from './models/User.js';
import TravelPlan from './models/TravelPlan.js';
import weatherService from './services/weatherService.js';
import placesService from './services/placesService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Parse requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch(err => {
    logger.error('MongoDB connection error:', err);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        logger.error('Authentication error:', err);
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ token, userId: user._id });
    } catch (error) {
        logger.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ token, userId: user._id });
    } catch (error) {
        logger.error('Signin error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/travel-plan', authenticateToken, async (req, res) => {
    try {
        const { destination, startDate, endDate, mood, budget } = req.body;
        
        // Get weather forecast
        const weatherForecast = await weatherService.getWeatherForecast(destination);
        
        // Get tourist attractions
        const attractions = await placesService.searchPlaces(destination);
        
        const travelPlan = new TravelPlan({
            userId: req.user._id,
            destination,
            startDate,
            endDate,
            mood,
            budget,
            weatherForecast,
            itinerary: generateItinerary(startDate, endDate, destination, budget, mood, attractions)
        });

        await travelPlan.save();
        res.json(travelPlan);
    } catch (error) {
        logger.error('Travel plan creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/travel-plans', authenticateToken, async (req, res) => {
    try {
        const plans = await TravelPlan.find({ userId: req.user._id });
        res.json(plans);
    } catch (error) {
        logger.error('Travel plans retrieval error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/places/search', authenticateToken, async (req, res) => {
    try {
        const { query, type } = req.query;
        const places = await placesService.searchPlaces(query, type);
        res.json(places);
    } catch (error) {
        logger.error('Places search error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/places/nearby', authenticateToken, async (req, res) => {
    try {
        const { lat, lng, type, radius } = req.query;
        const places = await placesService.getNearbyPlaces(lat, lng, type, radius);
        res.json(places);
    } catch (error) {
        logger.error('Nearby places error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/weather/:city', authenticateToken, async (req, res) => {
    try {
        const forecast = await weatherService.getWeatherForecast(req.params.city);
        res.json(forecast);
    } catch (error) {
        logger.error('Weather forecast error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to generate itinerary
function generateItinerary(startDate, endDate, destination, budget, mood, attractions) {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const dailyBudget = budget / days;
    
    const itinerary = [];
    for (let i = 1; i <= days; i++) {
        // Get random attractions for each day
        const dayAttractions = attractions
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        itinerary.push({
            day: i,
            activities: [
                {
                    time: '09:00',
                    activity: dayAttractions[0]?.name || 'Breakfast at local cafe',
                    location: dayAttractions[0]?.address || destination,
                    cost: dailyBudget * 0.2
                },
                {
                    time: '13:00',
                    activity: dayAttractions[1]?.name || (mood === 'relaxing' ? 'Spa session' : 'Museum visit'),
                    location: dayAttractions[1]?.address || destination,
                    cost: dailyBudget * 0.4
                },
                {
                    time: '19:00',
                    activity: dayAttractions[2]?.name || 'Dinner at local restaurant',
                    location: dayAttractions[2]?.address || destination,
                    cost: dailyBudget * 0.4
                }
            ]
        });
    }
    return itinerary;
}

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
});
