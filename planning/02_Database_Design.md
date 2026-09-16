# Sacred Journey - Database Design

## Tables

### 1. users
- id (PK)
- first_name
- last_name
- email (Unique)
- password
- phone
- profile_image
- role (USER, ADMIN)
- created_at
- updated_at

---

### 2. pilgrimage_circuits
- id (PK)
- name
- description
- total_temples
- estimated_days
- difficulty
- image_url

Examples:
- 12 Jyotirlingas
- Char Dham
- Panch Kedar
- Panch Kailash
- Tirumala

---

### 3. temples
- id (PK)
- circuit_id (FK)
- name
- deity
- state
- city
- latitude
- longitude
- description
- history
- timings
- best_season
- image_url

---

### 4. journeys
- id (PK)
- user_id (FK)
- circuit_id (FK)
- title
- start_date
- end_date
- budget
- status
- created_at

Status:
- Planned
- Ongoing
- Completed

---

### 5. journey_temples
- id (PK)
- journey_id (FK)
- temple_id (FK)
- visit_date
- completed
- notes

---

### 6. journal_entries
- id (PK)
- user_id (FK)
- temple_id (FK)
- title
- description
- image_url
- rating
- expense
- visit_date

---

### 7. achievements
- id (PK)
- name
- description
- badge_image

---

### 8. user_achievements
- id (PK)
- user_id (FK)
- achievement_id (FK)
- earned_at

---

### 9. certificates
- id (PK)
- user_id (FK)
- circuit_id (FK)
- certificate_number
- issue_date
- pdf_url

---

## Relationships

User
│
├── Journeys
├── Journal Entries
├── Certificates
└── Achievements

Pilgrimage Circuit
│
├── Temples
└── Journeys

Journey
│
└── Journey Temples

Temple
│
├── Journal Entries
└── Journey Temples