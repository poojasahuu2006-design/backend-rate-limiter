# ⚡ Advanced API Rate Limiter Backend

[![Live API](https://img.shields.io/badge/Live_API-Render_Cloud-brightgreen?style=for-the-badge&logo=render)](https://rate-limiter-lfpe.onrender.com/)
[![Swagger Docs](https://img.shields.io/badge/Swagger_UI-Interactive_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://rate-limiter-lfpe.onrender.com/api-docs/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A production-grade backend service for API rate limiting built with **Node.js, Express, and MongoDB**. This project implements **Token Bucket** and **Sliding Window Log** algorithms designed to handle high concurrency using MongoDB Optimistic Concurrency Control (OCC) and automated retries.

> 📖 **Live Interactive Swagger UI:** Test all endpoints live at **[rate-limiter-lfpe.onrender.com/api-docs/](https://rate-limiter-lfpe.onrender.com/api-docs/)**

## Features

- **Multiple Rate Limiting Algorithms**:
  - **Token Bucket**: Smooths out bursty traffic by adding tokens at a constant rate.
  - **Sliding Window Log**: Provides accurate rate limiting over a rolling 60-second time window.
- **Concurrency Control**: Handles race conditions gracefully under high traffic using MongoDB's Optimistic Concurrency Control (OCC) with an automatic retry mechanism.
- **Client Management**: Register multiple clients with custom rate limit configurations (capacity, refill rate, algorithm).
- **Load Testing**: Includes an automated load-testing script using `autocannon` to verify performance and concurrency handling under heavy load.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB & Mongoose**: NoSQL database and ODM for storing client configurations and state.
- **Autocannon**: HTTP/1.1 benchmarking tool used for load testing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Installation

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd backend-rate-limiter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string and preferred port (optional):
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```
   *(Note: Adjust the environment variable name for your MongoDB URI if you used a different one in `src/db/db.js`)*

4. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

### 1. Register a Client
Registers a new client with specific rate-limiting rules.
- **URL**: `/api/client/register` *(adjust if your route path is different)*
- **Method**: `POST`
- **Body**:
  ```json
  {
    "clientKey": "unique-client-identifier",
    "clientName": "My Awesome App",
    "capacity": 100,
    "refillRate": 10,
    "algorithm": "token_bucket" 
  }
  ```
  *(For `algorithm`, use either `"token_bucket"` or `"sliding_window"`)*

### 2. Check Rate Limit
Checks if the current request is allowed based on the client's rate limit settings.
- **URL**: `/api/client/check`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "clientKey": "unique-client-identifier"
  }
  ```
- **Response Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed.
  - `X-RateLimit-Remaining`: Remaining requests in the current window/bucket.
- **Response Status**:
  - `200 OK`: Request allowed.
  - `429 Too Many Requests`: Rate limit exceeded.

### 3. Get All Clients
Retrieves a list of all registered clients.
- **URL**: `/api/client/`
- **Method**: `GET`

## Load Testing

To verify how the application handles high concurrent traffic and to test the Optimistic Concurrency Control:

1. Ensure your local server is running.
2. If testing for a specific client, make sure a client with `clientKey: "load-test-client"` is registered in your database first.
3. Open a new terminal window and run:
   ```bash
   node load-test.js
   ```
The script uses `autocannon` to simulate 500 concurrent connections over 10 seconds to the `/check` endpoint and outputs a summary of allowed (2xx), denied (429), and errored (5xx) requests.
