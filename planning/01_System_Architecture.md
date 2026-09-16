# Sacred Journey - System Architecture

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA

### Database
- MySQL

### Storage
- Cloudinary (Temple & Journal Images)

### Maps
- Leaflet

---

## Architecture

Frontend (Next.js)
        |
     REST API
        |
Backend (Spring Boot)
        |
Service Layer
        |
Repository Layer
        |
MySQL Database

---

## Modules

### User Module
- Authentication
- Dashboard
- Profile

### Temple Module
- Temple Explorer
- Temple Details

### Journey Module
- Journey Planner
- My Journeys

### Journal Module
- Travel Journal

### Achievement Module
- Badges
- Certificates

### Admin Module
- Users
- Temples
- Circuits

---

## Authentication

JWT Token Based Authentication

Flow:

User
→ Login
→ JWT Generated
→ Token Stored
→ API Authorization

---

## Deployment

Frontend → Vercel

Backend → Render

Database → MySQL