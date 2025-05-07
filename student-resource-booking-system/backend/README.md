# Student Resource Booking System Backend

## Overview
This is the backend part of the Student Resource Booking System, built using Node.js, Express, and MongoDB. The backend handles all the API requests related to resource management, including creating, retrieving, updating, and deleting resources.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-resource-booking-system/backend
   ```

2. **Install dependencies**
   Run the following command to install the required packages:
   ```bash
   npm install
   ```

3. **Database Configuration**
   Ensure you have MongoDB installed and running. Update the database connection settings in `src/config/db.js` if necessary.

4. **Start the server**
   Use the following command to start the backend server:
   ```bash
   npm start
   ```

## Deployment

- **Backend**: [Deployed Backend Link](#)

## API Endpoints

### Resources
- **GET /api/resources**: Retrieve a list of all resources.
- **POST /api/resources**: Create a new resource.
- **PUT /api/resources/:id**: Update an existing resource by ID.
- **DELETE /api/resources/:id**: Delete a resource by ID.

## Folder Structure
- `src/app.js`: Entry point of the application.
- `src/controllers/resourceController.js`: Contains logic for handling resource-related requests.
- `src/models/resourceModel.js`: Defines the Resource model schema.
- `src/routes/resourceRoutes.js`: Sets up the routes for resource operations.
- `src/config/db.js`: Contains the MongoDB connection logic.

## License
This project is licensed under the MIT License.