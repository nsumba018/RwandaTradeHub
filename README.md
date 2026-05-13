# RwandaTrade Hub — Backend

Spring Boot REST API for an invoice financing platform connecting SMEs, investors, and administrators in Rwanda.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Security | Spring Security 6 + JWT |
| Database | PostgreSQL 15 |
| ORM | Spring Data JPA / Hibernate |
| Build | Maven |
| Testing | JUnit 5 + Mockito + Spring Security Test |

## Prerequisites

- Java 17 (`JAVA_HOME` must point to a JDK 17 installation)
- PostgreSQL 15 running locally (or via Docker)
- Maven 3.9+

## Running Locally

### 1. Database setup

```sql
CREATE DATABASE rwandatradehub;
CREATE USER rwandauser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE rwandatradehub TO rwandauser;
```

### 2. Configure `application.properties`

```
spring.datasource.url=jdbc:postgresql://localhost:5432/rwandatradehub
spring.datasource.username=rwandauser
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=<your-256-bit-secret>
jwt.expiration=86400000
```

### 3. Start the server

```bash
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn spring-boot:run
```

The API is available at `http://localhost:8080`.

## Demo Accounts (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@rwandatradehub.rw | admin123 |
| SME | amina@kigalifresh.rw | sme123 |
| Investor | david@equity.rw | investor123 |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### SME — Invoice Management (`ROLE_SME`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/invoices` | Upload a new invoice |
| GET | `/api/invoices/my-invoices` | List own invoices |
| GET | `/api/invoices/{id}` | Get a specific invoice |

### Investor — Marketplace (`ROLE_INVESTOR`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/investor/available-invoices` | Browse verified invoices |
| POST | `/api/investor/fund/{invoiceId}` | Fund an invoice |
| GET | `/api/investor/history` | View investment portfolio |

### Admin — Platform Management (`ROLE_ADMIN`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/invoices` | List all invoices |
| PUT | `/api/admin/invoices/{id}/verify` | Verify a pending invoice |
| PUT | `/api/admin/invoices/{id}/reject` | Reject a pending invoice |
| GET | `/api/admin/transactions` | View all funding transactions |

## Invoice Lifecycle

```
PENDING ──(admin verify)──► VERIFIED ──(investor fund)──► FUNDED
        ──(admin reject)──► REJECTED
```

## Running Tests

```bash
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn test
```

**75 tests** across 8 test classes — all passing:

| Test Class | Coverage | Tests |
|---|---|---|
| `AuthControllerTest` | Auth endpoints (register/login) | 5 |
| `AdminControllerTest` | Admin HTTP responses | 5 |
| `AdminControllerSecurityTest` | Admin RBAC — ADMIN ✓, SME ✗, INVESTOR ✗ | 10 |
| `InvoiceControllerTest` | Invoice HTTP responses + validation | 9 |
| `InvoiceControllerSecurityTest` | Invoice RBAC — SME ✓, INVESTOR ✗, ADMIN ✗ | 6 |
| `InvestorControllerTest` | Investor HTTP responses + validation | 7 |
| `InvestorControllerSecurityTest` | Investor RBAC — INVESTOR ✓, SME ✗, ADMIN ✗ | 9 |
| `AdminServiceTest` | Invoice verify/reject business logic | 10 |
| `InvestmentServiceTest` | Invoice funding business logic | 10 |
| `AuthServiceTest` | Registration + authentication logic | 4 |

## Project Structure

```
src/
├── main/java/com/rwandatradehub/
│   ├── config/          # SecurityConfig, application beans
│   ├── controller/      # REST controllers (Admin, Invoice, Investor, Auth)
│   ├── dto/             # Request/Response DTOs
│   ├── enums/           # InvoiceStatus, Role
│   ├── exception/       # Custom exceptions + global handler
│   ├── model/           # JPA entities (User, Invoice, Investment, Transaction)
│   ├── repository/      # Spring Data repositories
│   ├── security/        # JwtService, JwtAuthenticationFilter
│   └── service/         # Business logic (Admin, Invoice, Investment, Auth)
└── test/java/com/rwandatradehub/
    ├── controller/      # WebMvcTest + security tests
    └── service/         # Unit tests with Mockito
```

## Docker

A `docker-compose.yml` is included in the root of the monorepo to start the full stack (frontend + backend + PostgreSQL) with a single command:

```bash
docker-compose up --build
```
