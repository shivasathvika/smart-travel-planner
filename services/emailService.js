import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.NODE_ENV === 'production',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendWelcomeEmail(user) {
        try {
            await this.transporter.sendMail({
                from: `"Smart Travel Planner" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: "Welcome to Smart Travel Planner!",
                html: `
                    <h1>Welcome to Smart Travel Planner, ${user.username}!</h1>
                    <p>We're excited to help you plan your next adventure.</p>
                    <p>Get started by:</p>
                    <ul>
                        <li>Completing your profile</li>
                        <li>Setting your travel preferences</li>
                        <li>Creating your first trip plan</li>
                    </ul>
                    <p>Need help? Reply to this email or contact our support team.</p>
                `
            });
            logger.info(`Welcome email sent to ${user.email}`);
        } catch (error) {
            logger.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }

    async sendTripReminder(user, trip) {
        try {
            await this.transporter.sendMail({
                from: `"Smart Travel Planner" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: `Upcoming Trip to ${trip.destination}`,
                html: `
                    <h1>Your trip to ${trip.destination} is coming up!</h1>
                    <p>Trip Details:</p>
                    <ul>
                        <li>Destination: ${trip.destination}</li>
                        <li>Start Date: ${new Date(trip.startDate).toLocaleDateString()}</li>
                        <li>End Date: ${new Date(trip.endDate).toLocaleDateString()}</li>
                    </ul>
                    <h2>Weather Forecast</h2>
                    <p>${trip.weatherForecast ? 
                        `Expected temperatures between ${trip.weatherForecast[0].temp.min}°C and ${trip.weatherForecast[0].temp.max}°C` : 
                        'Weather forecast will be available closer to your trip date'}</p>
                    <p>View your complete itinerary on our website.</p>
                `
            });
            logger.info(`Trip reminder sent to ${user.email} for trip to ${trip.destination}`);
        } catch (error) {
            logger.error('Error sending trip reminder:', error);
            throw new Error('Failed to send trip reminder');
        }
    }

    async sendTripSummary(user, trip) {
        try {
            const itineraryHtml = trip.itinerary.map(day => `
                <div style="margin-bottom: 20px;">
                    <h3>Day ${day.day}</h3>
                    ${day.activities.map(activity => `
                        <p>
                            <strong>${activity.time}</strong>: ${activity.activity}<br>
                            Location: ${activity.location}<br>
                            Cost: $${activity.cost.toFixed(2)}
                        </p>
                    `).join('')}
                </div>
            `).join('');

            await this.transporter.sendMail({
                from: `"Smart Travel Planner" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: `Your Trip Plan for ${trip.destination}`,
                html: `
                    <h1>Your Trip to ${trip.destination}</h1>
                    <p>Here's your complete trip itinerary:</p>
                    <div style="margin: 20px 0;">
                        <strong>Duration:</strong> ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}<br>
                        <strong>Total Budget:</strong> $${trip.budget.toFixed(2)}
                    </div>
                    <div style="margin: 20px 0;">
                        <h2>Daily Itinerary</h2>
                        ${itineraryHtml}
                    </div>
                    <p>You can view and modify your trip plan anytime on our website.</p>
                `
            });
            logger.info(`Trip summary sent to ${user.email} for trip to ${trip.destination}`);
        } catch (error) {
            logger.error('Error sending trip summary:', error);
            throw new Error('Failed to send trip summary');
        }
    }
}

export default new EmailService();
