# 3amlk Platform - Backend Architecture & Description

## Platform Overview
Based on the backend implementation, the **3amlk** platform is a comprehensive on-demand local workers and service marketplace. It connects users who need tasks done or services rendered with skilled local workers. The platform facilitates the entire lifecycle of service provision, from user registration and worker onboarding to task posting, bidding, booking, and reviews.

Built on Java Spring Boot, the backend exposes a robust RESTful API structured around clear, distinct domains including authentication, worker profiles, task management, bookings, notifications, and administrative controls.

## Core Entities & Data Model
The system's core data models (Entities) outline the fundamental structure of the platform:
- **User**: The base account for anyone using the platform.
- **WorkerProfile**: An extension of a user account for those who offer services, containing details like skills, availability, and ratings.
- **Task**: A job or request posted by a user that needs to be fulfilled.
- **Offer**: A bid or proposal submitted by a worker for a specific task.
- **Booking**: A confirmed appointment or service agreement between a user and a worker.
- **Review**: Ratings and feedback given to workers after a completed job.
- **Notification**: System alerts sent to users/workers to keep them informed about task updates, booking statuses, or administrative actions.
- **OtpCode**: Used for secure authentication and verification flows.

## Features Breakdown

### 1. User Authentication & Account Management
Provides secure access and account controls.
- Registration, login, and secure logout.
- Password recovery and reset functionality.
- OTP (One-Time Password) based verification for enhanced security.
- Profile management, allowing standard users to upgrade their accounts to "Worker" status.

### 2. Task Marketplace
A complete bidding system for on-demand jobs.
- Users can post, update, and delete tasks.
- Workers can browse available tasks and submit **Offers**.
- Task creators can review offers and choose to **Accept** the most suitable one.

### 3. Worker Profiles & Discovery
Tools for workers to manage their business and for users to find help.
- Dedicated endpoints to retrieve worker lists and detailed profiles.
- Workers can manage their availability status and update their service profiles.
- A rating system allows users to rate workers based on their performance.

### 4. Booking System
Direct service scheduling.
- Users can directly create bookings with workers.
- Both users and workers have dedicated views to check their upcoming or past bookings.

### 5. Notification System
Keeps all parties informed about important events.
- Users can fetch their notifications and track unread notification counts.

### 6. Administration & Moderation
Comprehensive tools for platform owners to oversee operations.
- Dashboard statistics for high-level platform insights.
- A vetting process where admins can **approve or reject pending worker applications**.
- Moderation capabilities to view and delete users or tasks as needed.

---

## API Endpoints Reference
Below is the complete list of REST API endpoints exposed by the backend.

### Authentication (`/api/auth`)
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify the provided OTP
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate a user and receive a token
- `POST /api/auth/logout` - Invalidate the current session
- `GET /api/auth/me` - Retrieve the current authenticated user's profile
- `PUT /api/auth/me` - Update the current user's profile
- `POST /api/auth/become-worker` - Submit a request to upgrade a user account to a worker account
- `POST /api/auth/forgot-password` - Initiate the password recovery process
- `POST /api/auth/reset-password` - Reset password using a valid token/OTP

### Tasks & Offers (`/api/tasks`)
- `GET /api/tasks` - List all available tasks
- `GET /api/tasks/my` - List tasks created by the authenticated user
- `GET /api/tasks/{id}` - Get detailed information about a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `DELETE /api/tasks/{id}` - Delete a task
- `POST /api/tasks/{taskId}/offers` - Submit an offer (bid) for a task (Worker only)
- `GET /api/tasks/{taskId}/offers` - View all offers submitted for a specific task
- `POST /api/tasks/{taskId}/offers/{offerId}/accept` - Accept a specific offer for a task (Task Owner only)

### Workers (`/api/workers`)
- `GET /api/workers` - List all verified workers
- `GET /api/workers/{id}` - Get detailed profile of a specific worker
- `PUT /api/workers/availability` - Update the authenticated worker's availability status
- `PUT /api/workers/profile` - Update the authenticated worker's profile details
- `POST /api/workers/{workerId}/rate` - Submit a rating/review for a worker

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create a new booking/appointment
- `GET /api/bookings/my` - List all bookings made by the authenticated user
- `GET /api/bookings/worker` - List all bookings assigned to the authenticated worker

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Retrieve all notifications for the authenticated user
- `GET /api/notifications/unread-count` - Get the count of unread notifications

### Admin Dashboard (`/api/admin`)
- `GET /api/admin/stats` - Retrieve overall platform statistics
- `GET /api/admin/workers/pending` - List all workers awaiting approval
- `POST /api/admin/workers/{id}/approve` - Approve a pending worker profile
- `POST /api/admin/workers/{id}/reject` - Reject a pending worker profile
- `GET /api/admin/users` - List all registered users on the platform
- `DELETE /api/admin/users/{id}` - Delete a specific user account
- `GET /api/admin/tasks` - List all tasks on the platform (admin view)
- `DELETE /api/admin/tasks/{id}` - Delete a specific task (moderation)
