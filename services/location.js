const { Client } = require("@googlemaps/google-maps-services-js");
require("dotenv").config();

const googleMaps = new Client({});

class LocationService {
  static async getLocationDetails(lat, lng) {
    // try {
    //   const response = await googleMaps.reverseGeocode({
    //     params: {
    //       latlng: `${lat},${lng}`,
    //       key: process.env.GOOGLE_MAPS_API_KEY,
    //     },
    //   });
    //   return response.data.results[0].formatted_address;
    // } catch (error) {
    //   console.error("Google Maps error:", error);
    //   throw error;
    // }
    // Placeholder return value for testing
    return `Placeholder Address for Lat: ${lat}, Lng: ${lng}`;
  }
}

module.exports = LocationService;
