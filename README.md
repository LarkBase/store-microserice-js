# store-microserice-js
Ecommerce store using nodejs, prisma , nextjs , express - All as different microservices
1. User-Service
✅ Handles authentication, user profiles, sessions (JWT/Redis).
✅ Manages user CRUD operations.
✅ Stores user data in PostgreSQL via Prisma.

2. Product-Service
✅ Manages products, categories, inventory, and search.
✅ CRUD operations for products & categories.
✅ Caching with Redis for faster product queries.

3. Order-Service
✅ Handles orders, payments, and wishlist.
✅ Integrates payment gateway (Stripe, PayPal, etc.).
✅ Manages order history, tracking, and status updates.

4. API-Gateway
✅ Central entry point for routing requests to services.
✅ Handles rate limiting, authentication, request aggregation.
✅ Can use Express.js or Fastify as a lightweight API Gateway.

This structure is scalable and modular, so you can add new services easily later.

user-service/
│── src/
│   ├── controllers/        # Handles incoming HTTP requests and calls services
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── profile.controller.js
│   │
│   ├── services/           # Business logic, interacting with the database via repositories
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── profile.service.js
│   │
│   ├── repositories/       # Database access layer (Prisma or raw queries)
│   │   ├── user.repository.js
│   │   ├── auth.repository.js
│   │
│   ├── routes/             # Express routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │
│   ├── middleware/         # Middleware for authentication, validation, etc.
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │
│   ├── models/             # Prisma schema and database models
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Prisma schema definition
│   │   │   ├── migrations/    # Prisma migrations
│   │   │   ├── seed.js        # Database seeding script
│   │
│   ├── utils/              # Utility functions and helpers
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── response.js
│   │
│   ├── config/             # Configuration files
│   │   ├── database.js
│   │   ├── env.js
│   │
│   ├── tests/              # Unit and integration tests
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │
│   ├── index.js            # Entry point
│   ├── server.js           # Express app configuration
│   ├── app.js              # Initialize Express, middleware, routes
│
│── prisma/                 # Prisma client and migrations (if separate)
│── .env                    # Environment variables
│── .gitignore              # Ignored files
│── Dockerfile              # Docker configuration
│── docker-compose.yml      # Compose for local development
│── package.json            # Dependencies and scripts
│── README.md               # Documentation
│── jest.config.js          # Jest configuration for testing

