const { Client } = require("@googlemaps/google-maps-services-js");
require("dotenv").config();

const googleMaps = new Client({});

class LocationService {
  static async getLocationDetails(lat, lng) {
    return `Placeholder Address for Lat: ${lat}, Lng: ${lng}`;
  }
}

module.exports = LocationService;
