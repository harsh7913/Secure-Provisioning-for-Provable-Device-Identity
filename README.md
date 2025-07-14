# Secure Provisioning for Provable Device Identity

This project implements a secure, distributed provisioning system for smart devices, designed to operate across different trust boundaries — from an untrusted factory floor to a secure, on-premises infrastructure. The system ensures that each device receives a unique, cryptographic identity that it can later use to prove its legitimacy in the field.

---

## 📐 Architecture & Design Overview

### 🧩 Components
1. **Client-Side Provisioning Web App** (Operator Panel)
   - Used by factory operators to initiate device provisioning.
   - Built in React + TypeScript.
   - Sends provisioning requests to backend and displays status updates.

2. **House-Side Provisioning Backend Service**
   - Node.js + TypeScript backend.
   - Accepts, queues, and processes provisioning requests securely.
   - Delegates cryptographic identity generation to an HSM abstraction (`MockHSM` or `ProductionHSM`).
   - Uses BullMQ + Redis for job queuing.

3. **Admin Dashboard**
   - Internal tool for auditing and managing provisioned devices.
   - Provides secure login for administrators.
   - Displays detailed logs with filtering capabilities.

---

## 🔐 Key Design Decisions

### 1. **Provable Identity**
- Devices are issued cryptographic certificates and public keys signed by the backend.
- These credentials enable the device to prove its authenticity later in the field.

### 2. **Concurrency vs Sequential Hardware**
- BullMQ ensures concurrent provisioning requests are serialized before being processed by the HSM.
- This respects the constraint of one-at-a-time HSM operations.

### 3. **Network Architecture**
- Assumes house-side backend is not directly accessible from the internet.
- Communication is designed to occur via secure relays or polling mechanisms.

### 4. **Hardware Abstraction**
- An `IHSM` interface enables easy swapping between `MockHSM` (for testing) and `ProductionHSM` (for real deployment).

---

## 🚀 Getting Started (Local Setup)

### ⚙ Prerequisites
- Node.js v18+
- PostgreSQL
- Redis
- Docker (optional)
- `npm` or `pnpm`

---

### 📁 Environment Setup

1. Copy the example env file:
   ```
   cp .env.example .env
   ```

2. Ensure PostgreSQL and Redis are running locally.

---

### 🧱 Database Setup

```bash
cd Secure-Provisioning-for-Provable-Device-Identity-main
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
```

---

### 🖥 Run Backend

```bash
npm run dev
```

---

### 👷 Run Client App (Operator)

```bash
cd client-app
npm install
npm run dev
```

---

### 👩‍💼 Run Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

---

## 🧪 Seeded Login Credentials

| Role    | Email              | Password  |
|---------|--------------------|-----------|
| Admin   | admin@gmail.com    | admin123  |
| Operator| operator@gmail.com | admin123  |

---

## 📑 API Documentation

### Public Endpoints

#### `POST /admin/login`
Login for admin. Returns JWT.

#### `POST /provision`
Initiate provisioning. Requires operator role.

#### `GET /status/:id`
Check provisioning job status.

---

### Admin-Only Endpoints (require JWT)

#### `GET /admin/logs`
View all provisioning logs. Supports filtering.

---

## 📁 Folder Structure

```
/src              # Backend services and job processor
/client-app       # Operator frontend
/admin-dashboard  # Admin frontend
/prisma           # Prisma schema + seed script
.env.example      # Required env vars
```

---

## 📦 Submission Instructions

- ✅ Zip all contents (including this README).
- ❌ Do NOT include `.env` with real secrets.
- ✅ Include your resume in the zipped folder.
- ✅ Email to:
  - hiring@cypherock.com
  - riya@cypherock.com
  - akshit@cypherock.com
