🎟️ Event Booking App

A secure event management and booking application built with Node.js, Express, and MongoDB, featuring JWT-based authentication, role-based access control, and ticket booking functionality.

🚀 Features
👤 Authentication & Authorization

User registration & login with JWT-based authentication

Role-based access control:

Organizer → Create, update, delete events

Attendee → View events, book tickets

📅 Event Management

Organizers can create, edit, and delete events

Attendees can browse available events

Event data stored in MongoDB

🎟️ Ticket Booking

Attendees can book tickets for events

Checkout simulation implemented (no actual Stripe integration)

View list of purchased tickets

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB & Mongoose

Authentication: JWT (JSON Web Tokens)

Testing: Postman for API testing

Deployment: Render / Localhost

📂 Project Structure
event-booking-app/
│── models/          # MongoDB models (User, Event, Ticket)
│── routes/          # Express routes (Auth, Events, Tickets)
│── controllers/     # Business logic (eventController, authController)
│── middleware/      # JWT auth, role-based access middleware
│── config/          # DB connection & environment configs
│── server.js        # App entry point
│── package.json     # Dependencies & scripts

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/AmruthaTamada/event-booking-app.git
cd event-booking-app

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the root folder:

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

4️⃣ Run the App
npm start


Server will run on:
👉 http://localhost:5000

📡 API Endpoints
🔐 Auth Routes

POST /api/auth/register → Register new user

POST /api/auth/login → Login & get JWT

📅 Event Routes

POST /api/events/ → Create event (Organizer only)

GET /api/events/ → Get all events

GET /api/events/:id → Get single event

PUT /api/events/:id → Update event (Organizer only)

DELETE /api/events/:id → Delete event (Organizer only)

🎟️ Ticket Routes

POST /api/tickets/book/:eventId → Book ticket (Attendee)

GET /api/tickets/my → View booked tickets

🧪 Testing with Postman

Import API routes into Postman

Register/login to get JWT token

Pass token in Authorization header:

{ "Authorization": "Bearer <your-token>" }

📦 Deployment

Backend can be deployed on Render / Railway / Heroku

Frontend (if added later) can be deployed on Netlify / Vercel

During debugging, keep API base URL → http://localhost:5000

🔮 Future Improvements

✅ Integrate real Stripe payment gateway

✅ Add email notifications for bookings

✅ Build a React frontend for a complete full-stack solution

👨‍💻 Author

Amrutha TESR – Full-Stack Developer

📌 LinkedIn: https://www.linkedin.com/in/amrutha-tesr-47a20724b/
