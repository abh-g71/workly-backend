# Workly 🚀

A MERN Stack job marketplace platform that connects clients with skilled workers through skill-based and area-based matching.

## 📌 Overview

Workly is a full-stack web application designed to simplify hiring and job discovery. Clients can create jobs, find suitable workers, manage ongoing work, and rate completed jobs. Workers can create professional profiles, browse opportunities, and manage assigned tasks.

The platform implements secure authentication, role-based access control, smart matching, notifications, pagination, filtering, and performance-tested APIs.

---

## ✨ Features

### Authentication & Security

* JWT Authentication
* Secure Registration & Login
* Protected Routes
* Role-Based Access Control (Client / Worker)
* Authentication Middleware

### Worker Features

* Create Worker Profile
* Update Profile
* Add Skills and Experience
* Set Hourly Rate
* Manage Assigned Jobs
* Track Job Progress

### Client Features

* Create Jobs
* View Own Jobs
* Hire Workers
* Track Job Status
* Rate Workers

### Smart Matching

* Skill-Based Matching
* Area/Location-Based Matching
* Match Percentage Ranking
* Experience-Based Filtering
* Worker Rating Consideration

### Job Management

* Open Jobs
* In Progress Jobs
* Completed Jobs
* Job Ownership Validation
* Controlled Job Deletion

### Additional Features

* Notifications
* Pagination
* Filtering
* RESTful APIs
* MongoDB Integration
* Input Validation
* Error Handling

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend API (Node.js + Express)
          │
          ▼
JWT Authentication Middleware
          │
          ▼
MongoDB Database
```

---

## 🔐 Authentication Flow

1. User registers as Client or Worker.
2. User logs in using phone number and password.
3. Backend validates credentials.
4. JWT token is generated.
5. Token is sent to the frontend.
6. Protected routes verify token.
7. Role middleware checks permissions before granting access.

---

## 🎯 Matching System

Workly recommends suitable workers and jobs using:

* Skill Match Percentage
* Area/Location Matching
* Worker Experience
* Worker Ratings

This helps clients discover relevant workers while improving job visibility for workers.

---

## 📊 Job Lifecycle

```text
OPEN
 │
 ▼
IN_PROGRESS
 │
 ▼
COMPLETED
```

### Workflow

1. Client creates a job.
2. Worker is hired or assigned.
3. Job status changes to In Progress.
4. Work is completed.
5. Client rates the worker.
6. Job status becomes Completed.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Testing

* Postman
* Grafana k6

---

## 📂 Backend Structure

```text
src
│
├── controllers
│   └── usercontroller.js
│
├── middleware
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models
│   ├── User.js
│   ├── workerModel.js
│   ├── jobModel.js
│   └── notificationModel.js
│
├── routes
│   ├── userRoutes.js
│   ├── workerRoutes.js
│   ├── jobRoutes.js
│   └── notificationRoutes.js
│
└── server.js
```

---

## 📈 Performance Testing

Load testing was performed using Grafana k6.

### Test Configuration

* 100 Concurrent Virtual Users
* 30 Seconds Duration

### Results

| Metric                | Value            |
| --------------------- | ---------------- |
| Concurrent Users      | 100              |
| Total Requests        | 18,542           |
| Throughput            | 616 Requests/sec |
| Success Rate          | 100%             |
| Failure Rate          | 0%               |
| Average Response Time | 162 ms           |
| P95 Latency           | 206 ms           |
| Maximum Latency       | 380 ms           |

### Summary

The backend successfully handled 100 concurrent authenticated users with zero request failures while maintaining stable response times.

---

## 🚀 Future Improvements

* Real-Time Chat
* Redis Caching
* Payment Integration
* Advanced Search Filters
* Admin Dashboard
* AI-Based Worker Recommendations

---

## ⚙️ Installation

### Backend Setup

```bash
git clone <repository-url>

cd workly-backend

npm install

npm start
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd workly-frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 👨‍💻 Author

**Abhishek Gaur**

MERN Stack Developer | DSA Enthusiast | Problem Solver
