import fetch from 'node-fetch';
import logger from '../config/logger.js';

class PlacesService {
    constructor() {
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    }

    async searchPlaces(query, type = 'tourist_attraction') {
        try {
            const response = await fetch(
                `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&type=${type}&key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Places API error: ${response.statusText}`);
            }

            const data = await response.json();
            return this.processPlacesData(data);
        } catch (error) {
            logger.error('Error fetching places data:', error);
            throw new Error('Failed to fetch places data');
        }
    }

    async getPlaceDetails(placeId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,rating,formatted_address,formatted_phone_number,opening_hours,website,price_level,reviews&key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Place details API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            logger.error('Error fetching place details:', error);
            throw new Error('Failed to fetch place details');
        }
    }

    processPlacesData(data) {
        if (!data.results) return [];

        return data.results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            location: place.geometry.location,
            types: place.types,
            photo: place.photos?.[0]?.photo_reference
        }));
    }

    async getNearbyPlaces(latitude, longitude, type = 'tourist_attraction', radius = 5000) {
        try {
            const response = await fetch(
                `${this.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Nearby places API error: ${response.statusText}`);
            }

            const data = await response.json();
            return this.processPlacesData(data);
        } catch (error) {
            logger.error('Error fetching nearby places:', error);
            throw new Error('Failed to fetch nearby places');
        }
    }

    getPhotoUrl(photoReference, maxWidth = 400) {
        return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
    }
}

export default new PlacesService();
