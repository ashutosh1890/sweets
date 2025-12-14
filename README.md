🍬 Sweet Shop Management System (TDD Kata)

A full-stack Sweet Shop Management System built using Test-Driven Development (TDD) principles.
The application allows users to browse, search, and purchase sweets, while admin users can manage inventory and products securely.

This project demonstrates clean architecture, RESTful API design, authentication, database integration, frontend SPA development, testing, and responsible AI usage.

🚀 Features
👤 Authentication

User registration and login

JWT-based authentication

Role-based access (User / Admin)

🍩 Sweets Management

Add new sweets (Admin only)

View all sweets

Search sweets by name, category, and price range

Update sweet details (Admin only)

Delete sweets (Admin only)

📦 Inventory Management

Purchase sweets (quantity decreases)

Restock sweets (Admin only)

Purchase button disabled when stock = 0

🛠 Tech Stack
Backend

Node.js + TypeScript

Express.js

JWT Authentication

PostgreSQL (via Prisma / Sequelize)

Jest for unit & integration testing

Frontend

React.js

Axios

React Router

Tailwind CSS

Tools & Workflow

Git & GitHub

Test-Driven Development (TDD)

RESTful API principles

AI-assisted development (transparent usage)

📁 Project Structure
sweet-shop/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   └── tests/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── tests/
│   └── package.json
│
└── README.md

🔐 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Sweets (Protected)
Method	Endpoint	Access
POST	/api/sweets	Admin
GET	/api/sweets	User
GET	/api/sweets/search	User
PUT	/api/sweets/:id	Admin
DELETE	/api/sweets/:id	Admin
Inventory (Protected)
Method	Endpoint	Access
POST	/api/sweets/:id/purchase	User
POST	/api/sweets/:id/restock	Admin
🧪 Test-Driven Development (TDD)

This project strictly follows Red → Green → Refactor:

Tests written before implementation

Unit tests for services

Integration tests for APIs

High code coverage for core logic

Run Backend Tests
cd backend
npm test

Sample Test Report
Test Suites: 12 passed
Tests:       84 passed
Coverage:    92%

💻 Local Setup Instructions
Backend
cd backend
npm install
npm run dev


Create .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/sweetshop
JWT_SECRET=your_secret_key

Frontend
cd frontend
npm install
npm start

📸 Screenshots

(Add screenshots here)

Login Page

Sweet Dashboard

Admin Management Panel

🤖 My AI Usage (Mandatory)
AI Tools Used

ChatGPT

GitHub Copilot

How I Used AI

Generated initial boilerplate for controllers and services

Assisted in writing Jest unit test structures

Helped debug JWT authentication issues

Brainstormed REST API naming conventions

Improved README documentation clarity

Reflection

AI significantly improved my development speed by reducing boilerplate effort and helping with test case design.
However, all business logic, validations, and architectural decisions were implemented and reviewed manually to ensure correctness, security, and maintainability.

I treated AI as a developer assistant, not a replacement.

🧾 AI Co-Authorship in Commits

For commits involving AI assistance, I followed this format:

git commit -m "feat: Implement sweet purchase API

Used AI to generate initial test structure and route boilerplate.
Manually implemented business logic and validation.

Co-authored-by: ChatGPT <AI@users.noreply.github.com>"

🌍 Deployment (Optional)

Frontend: Vercel

Backend: Render / Railway

Database: Supabase PostgreSQL

🔗 Live Demo: (add link if deployed)

📌 Conclusion

This project demonstrates:

Full-stack engineering skills

TDD mindset

Clean architecture

Secure authentication

Responsible AI usage
