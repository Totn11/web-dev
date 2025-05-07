# Student Resource Booking System

This project is a Student Resource Booking System that allows students to book various resources. It is structured as a full-stack application with a React frontend and a Node.js/Express backend, utilizing MongoDB for data storage.

## Project Structure

```
student-resource-booking-system
├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── controllers
│   │   │   └── resourceController.js
│   │   ├── models
│   │   │   └── resourceModel.js
│   │   ├── routes
│   │   │   └── resourceRoutes.js
│   │   └── config
│   │       └── db.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.js
│   │   ├── components
│   │   │   └── ResourceList.js
│   │   ├── pages
│   │   │   └── BookingPage.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running, or access to a MongoDB cloud instance.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the backend dependencies:
   ```
   npm install
   ```

3. Set up the database connection in `backend/src/config/db.js` with your MongoDB URI.

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

## Deployment

- **Frontend**: [Deployed Frontend Link](#)
- **Backend**: [Deployed Backend Link](#)

## API Endpoints

- **GET /api/resources**: Retrieve a list of resources.
- **POST /api/resources**: Create a new resource.
- **PUT /api/resources/:id**: Update an existing resource.
- **DELETE /api/resources/:id**: Delete a resource.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.