# Sacred Journey - REST API Design

## Authentication

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

---

## Users

GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/change-password

---

## Temples

GET    /api/temples
GET    /api/temples/{id}
GET    /api/temples/search
GET    /api/temples/state/{state}
GET    /api/temples/circuit/{circuitId}

---

## Pilgrimage Circuits

GET    /api/circuits
GET    /api/circuits/{id}

---

## Journeys

POST   /api/journeys
GET    /api/journeys
GET    /api/journeys/{id}
PUT    /api/journeys/{id}
DELETE /api/journeys/{id}

---

## Journey Temples

POST   /api/journeys/{journeyId}/temples
PUT    /api/journeys/{journeyId}/temples/{templeId}
DELETE /api/journeys/{journeyId}/temples/{templeId}

---

## Journal

POST   /api/journal
GET    /api/journal
GET    /api/journal/{id}
PUT    /api/journal/{id}
DELETE /api/journal/{id}

---

## Achievements

GET    /api/achievements
GET    /api/users/achievements

---

## Certificates

GET    /api/certificates
GET    /api/certificates/{id}

---

## Admin

GET    /api/admin/users
PUT    /api/admin/users/{id}

POST   /api/admin/temples
PUT    /api/admin/temples/{id}
DELETE /api/admin/temples/{id}

POST   /api/admin/circuits
PUT    /api/admin/circuits/{id}
DELETE /api/admin/circuits/{id}