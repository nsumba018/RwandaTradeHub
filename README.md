# RwandaTrade Hub

Invoice financing platform connecting SMEs, investors, and administrators in Rwanda.

## Project Structure

```
RwandaTradeHub/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   └── Dockerfile
├── backend/           # Spring Boot 3 + Java 17 + PostgreSQL
│   └── Dockerfile
├── docker-compose.yml # Starts all three services with one command
└── README.md
```

## Running with Docker (recommended)

Make sure Docker and Docker Compose are installed, then:

```bash
docker compose up --build
```

That single command will:
- Pull the PostgreSQL 15 image
- Build the backend Spring Boot container
- Build the frontend Nginx container
- Wire them together on a shared network
- Start everything

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost      |
| Backend  | internal (port 8081)  |
| Database | internal (port 5432)  |

> The frontend Nginx container proxies all `/api` requests to the backend container internally — you only need to open one port (80).

To stop:
```bash
docker compose down
```

To stop and also delete the database volume:
```bash
docker compose down -v
```

---

## Running locally (development)

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 15 running on `localhost:5432`

Create the database:
```sql
CREATE DATABASE rwandatradehub_db;
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5174
# Vite automatically proxies /api → http://localhost:8081
```

---

## Test Accounts

| Role     | Email                       | Password    |
|----------|-----------------------------|-------------|
| Admin    | admin@rwandatradehub.rw     | admin123    |
| SME      | amina@kigalifresh.rw        | sme123      |
| SME      | claude@techsolutions.rw     | sme123      |
| Investor | invest@rdf.rw               | investor123 |
| Investor | david@equity.rw             | investor123 |

---

## Invoice Lifecycle

```
SME submits invoice (PENDING)
        ↓
Admin reviews and approves (VERIFIED)
        ↓
Investor sees it in marketplace and funds it (FUNDED)
```
