# Kommely Backend Documentation

## Overview
Kommely is a match-based platform designed to connect senior citizens with caregivers, providing a seamless, efficient, and secure caregiving experience. The platform allows seniors to find caregivers based on their health conditions, caregiving needs, and location proximity, while caregivers can find seniors that match their expertise and preferences. 

Key features include:
- Distress sound detection
- Fall detection
- GPS location tracking
- Secure messaging
- Caregiver reviews

This backend, built with **Node.js, Express, and MongoDB**, provides a robust API to support the Kommely platform’s functionality. It is deployed on Render at [kommely-backend.onrender.com](https://kommely-backend.onrender.com).

### Backend Functionalities
- User management for both seniors and caregivers
- Match-making based on health conditions, caregiving needs, and location proximity (within 50 km)
- Emergency alerts sent via SMS using Twilio
- Secure messaging between users
- Review system for caregivers

**Security Measures:**
- JWT-based authentication
- AES-256 encryption for sensitive data (e.g., phone numbers)
- Manual background checks for caregivers in the MVP

**Future Enhancements:**
- Real-time messaging with Twilio Conversations
- Google Maps integration for location processing
- Payment processing for subscriptions and commissions

## Tech Stack
- **Framework:** Node.js with Express
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **Authentication:** JSON Web Tokens (JWT)
- **SMS Notifications:** Twilio
- **Encryption:** AES-256 (via Node.js crypto module)
- **Deployment:** Render (PaaS)

## Project Structure
```plaintext
kommely-backend/
├── config/
│   └── db.js                    # MongoDB Atlas connection
├── models/
│   ├── senior.js                # Senior model
│   ├── caregiver.js             # Caregiver model
│   ├── review.js                # Review model
│   ├── message.js               # Message model
├── controllers/
│   ├── seniorController.js      # Senior-related operations
│   ├── caregiverController.js   # Caregiver-related operations
│   ├── emergencyController.js   # Emergency-related operations
│   ├── messageController.js     # Messaging operations
├── services/
│   ├── emergency.js             # Emergency handling logic
│   ├── twilio.js                # Twilio SMS integration
│   ├── location.js              # Location handling (placeholder)
│   ├── matching.js              # Match-making logic
├── routes/
│   ├── seniorRoutes.js          # Senior routes
│   ├── caregiverRoutes.js       # Caregiver routes
│   ├── emergencyRoutes.js       # Emergency routes
│   ├── messageRoutes.js         # Messaging routes
├── middleware/
│   ├── auth.js                  # JWT authentication middleware
├── utils/
│   ├── encryption.js            # AES-256 encryption utilities
│   ├── distance.js              # Distance calculation utility
├── .env                         # Environment variables
├── package.json                 # Project dependencies and scripts
├── server.js                    # Main server file
└── README.md                    # Project documentation
```

## API Endpoints
All API endpoints are prefixed with the base URL: [kommely-backend postman live documentation](https://documenter.getpostman.com/view/24266161/2sAYdhKqBW). For detailed request and response examples, refer to the Postman Documentation.

### Authentication
#### Senior Authentication
- **Register Senior (POST /senior/register)**
  - Description: Registers a new senior user.
  - Headers: `Content-Type: application/json`
  - Notes: Requires fields like `name`, `email`, `password`, `emergencyContacts`, `location`, etc. Emergency contacts are encrypted using AES-256.

- **Login Senior (POST /senior/login)**
  - Description: Authenticates a senior user and returns a JWT.
  - Headers: `Content-Type: application/json`
  - Notes: Returns a JWT valid for 1 hour.

#### Caregiver Authentication
- **Register Caregiver (POST /caregiver/register)**
  - Description: Registers a new caregiver.
  - Headers: `Content-Type: application/json`
  - Notes: Requires fields like `name`, `email`, `password`, `phoneNumber`, `location`, etc. Phone number is encrypted using AES-256.

- **Login Caregiver (POST /caregiver/login)**
  - Description: Authenticates a caregiver and returns a JWT.
  - Headers: `Content-Type: application/json`
  - Notes: Returns a JWT valid for 1 hour.

### Match-Making
- **Match Caregivers for Senior (GET /senior/match-caregivers/:seniorId)**
  - Description: Finds caregivers that match a senior based on health conditions, caregiving needs, and location proximity.
  - Headers: `Authorization: Bearer <token>`
  - Parameters: `seniorId` (path) - The ID of the senior.
  - Notes: Matches are within 50 km and based on overlapping health conditions or caregiving needs.

- **Match Seniors for Caregiver (GET /caregiver/match-seniors/:caregiverId)**
  - Description: Finds seniors that match a caregiver based on health conditions, caregiving needs, and location proximity.
  - Headers: `Authorization: Bearer <token>`
  - Parameters: `caregiverId` (path) - The ID of the caregiver.
  - Notes: Matches are within 50 km and based on overlapping health conditions or caregiving needs.

- **Assign Caregiver to Senior (POST /caregiver/assign)**
  - Description: Assigns a caregiver to a senior.
  - Headers: `Authorization: Bearer <token>`
  - Notes: Links a caregiver to a senior for emergency alerts and messaging.

### Emergency Alerts
- **Trigger Emergency Alert (POST /emergency/detect)**
  - Description: Triggers an emergency alert (fall or distress sound) and sends SMS to the senior’s emergency contacts and assigned caregiver.
  - Headers: `Authorization: Bearer <token>`
  - Notes: Supports `eventType` values "fall" or "scream". SMS is sent via Twilio.

- **Check Battery Level (POST /emergency/battery)**
  - Description: Sends a low battery alert if the battery level is 20% or below.
  - Headers: `Authorization: Bearer <token>`
  - Notes: Triggers SMS if `batteryLevel` is ≤ 20%.

### Messaging
- **Send Message (POST /messages/send)**
  - Description: Sends a message from one user to another (senior to caregiver or vice versa).
  - Headers: `Authorization: Bearer <token>`
  - Notes: Requires `receiverId`, `receiverRole`, and `content`.

- **Get Messages (GET /messages/:userId)**
  - Description: Retrieves messages for a user (sent and received).
  - Headers: `Authorization: Bearer <token>`
  - Parameters: `userId` (path) - The ID of the user.

### Reviews
- **Submit Review (POST /caregiver/reviews)**
  - Description: Submits a review for a caregiver by a senior.
  - Headers: `Authorization: Bearer <token>`
  - Notes: Requires `caregiverId`, `rating` (1-5), and optional `comment`.

- **Get All Caregivers (With Reviews) (GET /caregiver/users)**
  - Description: Retrieves all caregivers, including their reviews.
  - Headers: `Authorization: Bearer <token>`
  - Notes: Includes reviews with the senior’s name, rating, and comment.
