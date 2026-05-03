# 3amlk Platform — Backend Architecture & API Reference

## 1. Platform Overview

**3amlk** is an on-demand local workers and service marketplace. The platform connects users who need tasks or services with skilled local workers such as plumbers, carpenters, electricians, and other service providers.

The backend supports the full service lifecycle, including:

- User registration and authentication
- Worker onboarding and profile management
- Task posting and offer submission
- Booking and appointment management
- Reviews and ratings
- Notifications
- Administrative approval and moderation

The backend is built with **Java Spring Boot** and exposes a RESTful API organized around clear functional domains: authentication, tasks, workers, bookings, notifications, and administration.

---

## 2. Core Entities & Data Model

| Entity | Description |
|---|---|
| **User** | The base account used by anyone accessing the platform. |
| **WorkerProfile** | An extension of a user account for people offering services. It includes skills, availability, ratings, and worker-specific details. |
| **Task** | A job or service request posted by a user. |
| **Offer** | A bid or proposal submitted by a worker for a specific task. |
| **Booking** | A confirmed appointment or service agreement between a user and a worker. |
| **Review** | Ratings and feedback submitted after a completed job. |
| **Notification** | System alerts sent to users and workers about important activity. |
| **OtpCode** | One-time password data used for secure verification and recovery flows. |

---

## 3. Features Breakdown

### 3.1 User Authentication & Account Management

Provides secure access and account controls.

- Register, log in, and log out users.
- Retrieve and update the authenticated user's profile.
- Send and verify OTP codes.
- Recover and reset passwords.
- Allow standard users to request an upgrade to worker status.

### 3.2 Task Marketplace

Provides a bidding-based marketplace for on-demand jobs.

- Users can create, update, and delete tasks.
- Workers can browse available tasks.
- Workers can submit offers for tasks.
- Task owners can review submitted offers.
- Task owners can accept the most suitable offer.

### 3.3 Worker Profiles & Discovery

Allows workers to manage their public profiles and helps users find service providers.

- List verified workers.
- View detailed worker profiles.
- Let workers update their profile information.
- Let workers update their availability status.
- Allow users to rate and review workers.

### 3.4 Booking System

Handles direct service scheduling between users and workers.

- Users can create bookings with workers.
- Users can view their own bookings.
- Workers can view bookings assigned to them.

### 3.5 Notification System

Keeps users and workers informed about platform activity.

- Retrieve user notifications.
- Track unread notification counts.

### 3.6 Administration & Moderation

Provides admin tools for platform oversight.

- View dashboard statistics.
- Review pending worker applications.
- Approve or reject worker profiles.
- View and delete users.
- View and delete tasks for moderation purposes.

---

## 4. API Endpoints Reference

### 4.1 Authentication Endpoints

**Base path:** `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/send-otp` | Send an OTP code for verification. |
| `POST` | `/api/auth/verify-otp` | Verify a submitted OTP code. |
| `POST` | `/api/auth/register` | Register a new user account. |
| `POST` | `/api/auth/login` | Authenticate a user and return an access token/session. |
| `POST` | `/api/auth/logout` | Invalidate the current session. |
| `GET` | `/api/auth/me` | Retrieve the authenticated user's profile. |
| `PUT` | `/api/auth/me` | Update the authenticated user's profile. |
| `POST` | `/api/auth/become-worker` | Submit a request to upgrade a user account to worker status. |
| `POST` | `/api/auth/forgot-password` | Start the password recovery process. |
| `POST` | `/api/auth/reset-password` | Reset a password using a valid token or OTP. |

---

### 4.2 Tasks & Offers Endpoints

**Base path:** `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all available tasks. |
| `GET` | `/api/tasks/my` | List tasks created by the authenticated user. |
| `GET` | `/api/tasks/{id}` | Get details for a specific task. |
| `POST` | `/api/tasks` | Create a new task. |
| `PUT` | `/api/tasks/{id}` | Update an existing task. |
| `DELETE` | `/api/tasks/{id}` | Delete a task. |
| `POST` | `/api/tasks/{taskId}/offers` | Submit an offer for a task. Worker only. |
| `GET` | `/api/tasks/{taskId}/offers` | View all offers submitted for a task. |
| `POST` | `/api/tasks/{taskId}/offers/{offerId}/accept` | Accept a specific offer. Task owner only. |

---

### 4.3 Worker Endpoints

**Base path:** `/api/workers`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workers` | List all verified workers. |
| `GET` | `/api/workers/{id}` | Get the detailed profile of a specific worker. |
| `PUT` | `/api/workers/availability` | Update the authenticated worker's availability status. |
| `PUT` | `/api/workers/profile` | Update the authenticated worker's profile details. |
| `POST` | `/api/workers/{workerId}/rate` | Submit a rating or review for a worker. |

---

### 4.4 Booking Endpoints

**Base path:** `/api/bookings`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a new booking or appointment. |
| `GET` | `/api/bookings/my` | List bookings created by the authenticated user. |
| `GET` | `/api/bookings/worker` | List bookings assigned to the authenticated worker. |

---

### 4.5 Notification Endpoints

**Base path:** `/api/notifications`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Retrieve notifications for the authenticated user. |
| `GET` | `/api/notifications/unread-count` | Get the number of unread notifications. |

---

### 4.6 Admin Dashboard Endpoints

**Base path:** `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Retrieve overall platform statistics. |
| `GET` | `/api/admin/workers/pending` | List workers awaiting approval. |
| `POST` | `/api/admin/workers/{id}/approve` | Approve a pending worker profile. |
| `POST` | `/api/admin/workers/{id}/reject` | Reject a pending worker profile. |
| `GET` | `/api/admin/users` | List all registered users. |
| `DELETE` | `/api/admin/users/{id}` | Delete a specific user account. |
| `GET` | `/api/admin/tasks` | List all tasks in admin view. |
| `DELETE` | `/api/admin/tasks/{id}` | Delete a specific task for moderation. |

---

## 5. Suggested Frontend Structure

This section can help an AI coding assistant or frontend developer understand how to organize the mobile or web client.

### Public User Area

- Browse available workers.
- View worker profiles.
- Create service bookings.
- Post new tasks.
- View offers submitted by workers.
- Accept an offer.
- Rate workers after service completion.

### Worker Area

- Register or upgrade to worker status.
- Manage worker profile.
- Update availability.
- Browse available tasks.
- Submit offers.
- View assigned bookings.
- Receive notifications.

### Admin Area

- View dashboard statistics.
- Review pending worker applications.
- Approve or reject workers.
- Manage users.
- Moderate tasks.

---

## 6. Notes for AI-Assisted Development

When using this document with an AI coding assistant, the assistant should:

- Treat this file as the main backend reference.
- Generate frontend screens based on the listed domains.
- Use the API endpoints exactly as documented unless backend code says otherwise.
- Separate user, worker, and admin flows clearly.
- Implement authentication handling before protected features.
- Use reusable API service functions for each domain.
- Add loading, error, and empty states for all API-driven screens.
- Keep the UI simple and testable before adding advanced design details.
