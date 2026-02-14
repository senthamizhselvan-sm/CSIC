# VerifyOnce - Proof-Based Digital Identity System

## Project Overview

VerifyOnce is a privacy-first digital identity verification system. Users verify their identity once through trusted issuers, store a credential in a wallet, and then generate short-lived, privacy-preserving proofs for verifiers. Verifiers receive minimal yes/no signals instead of raw documents.

Core ideas:
- No repeated document uploads
- User-controlled approvals for every request
- Minimal data exposure (attribute proofs instead of document scans)
- Short-lived verification requests

---

## Architecture

```
┌─────────────────┐
│  User Wallet    │ (React Frontend)
│  /wallet        │
└────────┬────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
┌───▼─────────────────┐   ┌────────▼──────────────┐
│  Backend API        │   │  MongoDB Atlas        │
│  Port: 5000         │   │  (User, Credential,   │
│  Node.js/Express    │   │   Verification data)  │
└─────────────────────┘   └───────────────────────┘
    │
    ├── /api/auth (register, login, demo endpoints)
    ├── /api/wallet (credentials management)
    └── /api/verification (request, approve, status)
```

---

## Data Models (MongoDB)

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'business',
  phone: String (optional),
  createdAt: Date
}
```

### Credential
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (default: 'government_id'),
  issuer: String,
  data: {
    fullName: String,
    dateOfBirth: String, // never shared
    nationality: String,
    idNumber: String // never shared
  },
  verifiedAt: Date,
  validUntil: Date,
  isActive: Boolean
}
```

### Verification
```javascript
{
  _id: ObjectId,
  requestId: String (unique),
  businessName: String,
  businessId: ObjectId (ref: User),
  userId: ObjectId (ref: User),
  requestedData: [{ field: String, type: String }],
  status: 'pending' | 'approved' | 'denied' | 'expired',
  sharedData: {
    ageVerified: Boolean,
    ageRange: String,
    nameVerified: Boolean,
    nationality: String
  },
  cryptographicProof: String, // simulated
  blockchainTxId: String,     // simulated
  expiresAt: Date,
  createdAt: Date
}
```

---

## Frontend Routes

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/` | Landing.jsx | Public | Marketing + feature overview |
| `/demo` | LiveDemo.jsx | Public | Split-screen demo (iframed views) |
| `/user/login` | UserLogin.jsx | Public | User wallet login |
| `/user/signup` | UserSignup.jsx | Public | User wallet registration |
| `/business/login` | BusinessLogin.jsx | Public | Verifier login |
| `/business/signup` | BusinessSignup.jsx | Public | Verifier registration |
| `/wallet` | UserDashboard.jsx | Protected (user) | Wallet + approvals |
| `/user` | UserDashboard.jsx | Protected (user) | Alias for wallet |
| `/verifier` | BusinessVerifier.jsx | Protected (business) | Simple verifier flow |
| `/business` | BusinessPortal.jsx | Protected (business) | Full verifier portal |
| `/login` | Redirect | Public | Redirects to `/user/login` |
| `/signup` | Redirect | Public | Redirects to `/user/signup` |

Note: `/demo` embeds `/business` and `/user`. Both are protected, so the demo requires valid sessions (use demo accounts or seed data).

---

## User Dashboard (Wallet) Details

The user wallet UI is a multi-section dashboard with both desktop and mobile layouts. It is rendered by `UserDashboard.jsx` and is protected for `role: user`.

### Desktop Sections
- **Wallet Overview**: DID, device/last login, privacy score, total verifications, active proofs, expiry alerts, and a primary credential card with actions (view, generate proof, renew).
- **Credential Vault**: Search/filter controls, credential cards with issuer and status, quick actions (view/revoke), and add-credential tiles (education, employment, health, license).
- **Live Verification Requests**: Active request card with request code, timer, requested vs not shared attributes, approve/reject actions, and a short pending history table.
- **Active Proofs Monitor**: Active proof card with countdown, shared attributes, generated/expiry times, actions (view, revoke, extend), and a table of recently expired proofs.
- **Activity Log + Analytics**: Metrics dashboard, full activity table, pagination controls, and export actions (CSV/PDF/report).
- **Security & Privacy Center**: System status checks, active sessions table, security settings toggles, and emergency controls (revoke proofs, lock wallet, reset).
- **Add Credential**: Code input flow with success/error states plus a “How it works” explainer.

### Mobile Layout
- **Tabs**: Dashboard, Credentials, Activity, Security.
- **Dashboard Tab**: Credential card, quick stats, live request card, quick action grid, expiry alert, and search.
- **Credentials Tab**: Existing credentials list plus add-new credential form.
- **Activity Tab**: Active proofs monitor, analytics cards, recent activity list, export actions.
- **Security Tab**: Security status, account details, active sessions, security settings, and emergency actions.
- **Modals**: Approve verification request, check status, view info, liveness check, revoke credential.

---

## Verifier Dashboard Details

Verifier experiences have two levels:
- **Business Portal** (`/business`): Full verifier dashboard and management portal.
- **Business Verifier** (`/verifier`): Minimal flow for creating a request and checking status.

### Business Portal (Full Dashboard)
- **Welcome overlay**: First-time verifier success message with quick actions.
- **Top navbar**: Search, notifications, org name, admin user, audit shortcut, settings/help/logout.
- **Left sidebar navigation**: Dashboard, Create Request, Active Requests, Verification Results, History and Analytics, Compliance Center, API and Integrations, Settings.
- **Right sidebar**: Compliance score card showing zero PII stored and GDPR compliance.

**Dashboard view (VerifierOverview)**
- Organization profile: name, verifier ID, status, industry, since date.
- Real-time metrics: today requests, active proofs, success rate, average time.
- Data liability status: documents stored, PII records, retention policy, GDPR and data minimization indicators.
- Quick actions: create request, analytics, compliance report, settings.
- Quick request builder: purpose presets (hotel, bank, age, employment) and recent activity preview.

**Create Request view (RequestBuilder modal)**
- Multi-step flow: select purpose, select attributes, configure expiry and privacy mode, then show QR code.
- Attribute selection includes risk labels and restricted attributes (no ID numbers, birthdates, photos, full addresses).
- Privacy modes: zero-knowledge (yes/no) vs selective disclosure.
- QR code output with request ID and share actions (copy, SMS, email).

**Other portal sections (components)**
- Active Requests: live monitoring view.
- Verification Results: results dashboard.
- History and Analytics: historical metrics.
- Compliance Center: compliance status and guidance.
- API and Integrations: integration hub.
- Settings: organization settings.

### Business Verifier (Simple Flow)
- Create verification request with minimal attributes (age verification only).
- QR code display and request ID sharing.
- Status polling to retrieve approved results.
- Verification result shows shared data and simulated cryptographic proof.

---

## Backend API

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | None | Create user or business account |
| POST | `/login` | None | Sign in (returns JWT) |
| GET | `/demo-user` | None | Auto-create demo user + token |
| GET | `/demo-business` | None | Auto-create demo business + token |

### Wallet (`/api/wallet`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/credentials` | JWT | Fetch user credentials |
| POST | `/add-credential` | JWT | Add credential to wallet |

### Verification (`/api/verification`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/request` | JWT | Business creates verification request |
| POST | `/approve/:requestId` | JWT | User approves request (creates proof) |
| GET | `/status/:requestId` | JWT | Business checks request status |

Request IDs look like `VF-ABC123` and expire after 5 minutes.

---

## Tech Stack

### Frontend
- React 19
- React Router v7
- Axios
- qrcode.react
- Vite
- Plain CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcryptjs
- dotenv, cors

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string

### Backend
```bash
cd backend
npm install

# Create .env with:
# MONGO_URI=<your_mongodb_connection_string>
# PORT=5000
# JWT_SECRET=supersecretkey123

node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:5000`
Frontend: `http://localhost:5173`

---

## Demo Accounts and Seeding

### Seed Script
```bash
cd backend
node seed.js
```

This resets Users and Credentials and creates:
- Demo user: `demo@user.com` / `demo123`
- Demo business: `demo@business.com` / `demo123`
- Demo credential for the user

### Demo Endpoints
You can also call:
- `GET /api/auth/demo-user`
- `GET /api/auth/demo-business`

These auto-create accounts if they do not exist and return JWTs.

---

## Typical Flow

1. Business creates a request via `/api/verification/request`.
2. User sees the request code and approves via `/api/verification/approve/:requestId`.
3. Business checks status via `/api/verification/status/:requestId`.
4. The shared data is minimal (e.g., age verified and nationality).

---

## Notes and Known Gaps

- Proofs are simulated (not real ZK proofs).
- Only the request expiry (5 minutes) is enforced in data; proof expiry is not modeled yet.
- Business signup collects extra fields in the frontend, but the backend User model currently stores only name/email/password/role.
- The frontend uses fixed API URLs pointing to `http://localhost:5000`.

---

## License

ISC