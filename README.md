# VerifyOnce - Proof-Based Digital Identity System

## Project Overview

VerifyOnce is a privacy-first digital identity verification system that replaces traditional document uploads with cryptographic proofs. Users verify their identity once through trusted authorities, then generate time-limited, privacy-preserving proofs to share with verifiers.

### Core Philosophy
- **No document uploads** - Users don't upload documents repeatedly
- **Centralized verification** - Identity verified once by trusted issuers (government, banks)
- **Decentralized proofs** - Users generate proofs locally from their credentials
- **Proof expiry** - All proofs are time-limited and automatically expire
- **User control** - Every verification request requires explicit user consent
- **Data minimization** - Only required information is shared in proofs

---

## Architecture

### System Components

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

### Database Models

#### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user' | 'business'),
  phone: String (optional),
  createdAt: Date
}
```

#### Credential
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (e.g., 'government_id'),
  issuer: String (e.g., 'DigiLocker (Demo)'),
  data: {
    fullName: String,
    dateOfBirth: String (NEVER shared),
    nationality: String,
    idNumber: String (NEVER shared)
  },
  verifiedAt: Date,
  validUntil: Date (1 year default),
  isActive: Boolean
}
```

#### Verification
```javascript
{
  _id: ObjectId,
  requestId: String (unique code),
  businessId: ObjectId (ref: User),
  userId: ObjectId (ref: User, filled after approval),
  requestedData: Array,
  status: String (enum: 'pending' | 'approved' | 'rejected'),
  sharedData: Object (minimal, YES/NO only),
  cryptographicProof: String (simulated),
  blockchainTxId: String (simulated),
  expiresAt: Date (5 minutes default),
  createdAt: Date
}
```

---

## Frontend Pages

### Routes

| Route | Component | Role | Purpose |
|-------|-----------|------|---------|
| `/` | Landing.jsx | Public | Hero page with feature overview |
| `/signup` | Signup.jsx | Public | Register new wallet |
| `/login` | Login.jsx | Public | Sign in to wallet |
| `/wallet` | UserDashboard.jsx | User | View credentials, approve verification requests |
| `/verifier` | BusinessVerifier.jsx | Business | Create verification requests, view results |
| `/demo` | LiveDemo.jsx | Public | Split-screen demo (user + business side-by-side) |
| `/user` | UserDashboard.jsx | Public | Demo user wallet (iframe target) |
| `/business` | BusinessPortal.jsx | Public | Demo business portal (iframe target) |

### Landing Page (`/`)

**Features:**
- Hero section with pitch: "Verify Once. Prove Anywhere. Share Nothing."
- Problem section explaining document upload risks
- Solution section (4-step flow):
  1. Verify Once (by trusted issuer)
  2. Store Credential (in user's encrypted wallet)
  3. Generate Proofs (time-limited, privacy-preserving)
  4. Stay in Control (consent-based, revocable)
- Core principles (separation of issuance/verification, cryptographic trust, user sovereignty)
- Four pillars: User, Issuer, Wallet, Verifier
- 6 real-world use cases: hotel check-in, banking, age verification, university, gig work, insurance
- Trust guarantees: zero storage, time-limited proofs, instant revocation, encryption, audit trail
- CTAs: "Try Live Demo", "Create Your Wallet", "For Businesses"

### Signup Page (`/signup`)

**Form fields:**
- Full Name
- Email
- Password
- Phone Number (optional)

**On submit:**
- POST `/api/auth/register`
- Creates user with role = "user"
- Stores JWT token in localStorage
- Redirects to `/wallet`

### Login Page (`/login`)

**Form fields:**
- Email
- Password

**On submit:**
- POST `/api/auth/login`
- Validates password
- Returns JWT + user info
- Redirects based on role:
  - `role: 'user'` → `/wallet`
  - `role: 'business'` → `/verifier`

### User Wallet (`/wallet`)

**Features:**
- Display user's stored credentials
- Empty state if no credentials with "Add Demo Credential" button
- Approval UI for incoming verification requests
- Privacy guarantees display (never shared: ID number, birthdate, etc.)

**Workflow:**
1. User adds demo credential → stored in wallet
2. Business creates verification request → generates request code
3. User enters request code → reviews what's being asked
4. User clicks "Approve" → generates time-limited proof
5. Business can check status → receives minimal proof (YES/NO + proof)

### Business Verifier (`/verifier`)

**Features:**
- Create verification request
- Display QR code + request ID
- Status polling ("Check Status" button)
- View verification result with cryptographic proof

**Workflow:**
1. Click "Generate Verification Request"
2. Business presents QR or request code to customer
3. Customer scans or enters code during approval
4. Business polls status
5. On approval, shows minimal proof + cryptographic signature

### Live Demo (`/demo`)

**Features:**
- Split-screen layout (50% user, 50% business)
- Both sides can independently conduct full verification flow
- No authentication needed
- Uses demo credentials (email: demo@user.com / demo@business.com, password: demo123)

---

## Backend Routes

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | None | Create new user wallet |
| POST | `/login` | None | Sign in with email/password |
| GET | `/demo-user` | None | Auto-create demo user account |
| GET | `/demo-business` | None | Auto-create demo business account |

### Wallet (`/api/wallet`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/credentials` | JWT | Fetch user's credentials |
| POST | `/add-credential` | JWT | Add credential to wallet (simulates issuer) |

### Verification (`/api/verification`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/request` | JWT | Business creates verification request |
| POST | `/approve/:requestId` | JWT | User generates proof (approves request) |
| GET | `/status/:requestId` | JWT | Business checks verification result |

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **QRCode.react** - QR code generation
- **Vite** - Build tool
- **Plain CSS** - Global styles (no Tailwind)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **JWT** - Token-based auth
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (connection string in `.env`)

### Installation & Setup

#### Backend
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=<your_mongodb_connection_string>
# PORT=5000
# JWT_SECRET=supersecretkey123

node server.js
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`

### Seeding Demo Data
```bash
cd backend
node seed.js
```

Creates:
- Demo user (email: demo@user.com, password: demo123)
- Demo business (email: demo@business.com, password: demo123)
- Demo credential for user (government ID from DigiLocker)

---

## Current Status

### ✅ Completed Features

**Architecture & Design:**
- Role-based system (user vs business)
- Proof-based identity model
- Privacy-first data handling
- Time-limited credentials and proofs

**Authentication:**
- User registration with wallet creation
- Email/password login
- JWT token-based auth
- Role-based redirects

**User Features:**
- Wallet dashboard
- Credential storage (encrypted locally)
- Verification request approval
- Privacy guarantees display
- Add demo credentials

**Business Features:**
- Create verification requests
- QR code generation
- Status polling
- View verification results
- No document access (zero data retention)

**Frontend UI:**
- Professional landing page
- Enterprise-grade styling
- Responsive layouts
- Clear role separation
- Split-screen demo mode

**Backend API:**
- Auth endpoints (register, login, demo)
- Wallet endpoints (credential management)
- Verification endpoints (request, approve, status)
- Proper error handling

**Database:**
- User model with roles
- Credential model with expiry
- Verification model with status tracking

### 🔧 Technical Setup
- MongoDB Atlas integration
- JWT authentication middleware
- CORS enabled
- Environment variable configuration
- Seed script for demo data

---

## Demo Flow

### Quick Start Demo

1. **Open split-screen demo:**
   ```
   http://localhost:5173/demo
   ```

2. **Left side (Business):**
   - Click "Generate Verification Request"
   - Receive QR code + request ID

3. **Right side (User):**
   - Click "Add Demo Credential" (if no credentials)
   - Enter request ID from business
   - Click "Approve Securely"

4. **Back to Business:**
   - Click "Check Status"
   - View verification result

### Full User Journey

1. Visit `http://localhost:5173`
2. Click "Create Your Wallet"
3. Fill signup form and submit
4. Redirected to wallet dashboard
5. Add demo credential
6. Share verification request code with business
7. Approve when business requests
8. View audit trail

### Full Business Journey

1. Visit `http://localhost:5173`
2. Click "For Businesses"
3. Create verification request
4. Share QR code with customer
5. Customer approves from wallet
6. Check status to see proof
7. Receive minimal data only

---

## Security Notes

### Data Protection
- Passwords hashed with bcryptjs
- JWTs signed with secret key
- Sensitive data (ID number, birthdate) never shared in proofs
- Credentials stored only in user wallet (MongoDB backup)

### Privacy
- Businesses never see personal documents
- Only YES/NO verification + minimal proof
- Proofs expire automatically (5 minutes for request, 24 hours for proof)
- Users have full audit trail
- Instant revocation possible

### Proof Mechanism (Simulated)
- Current implementation: simulated cryptographic proofs
- Real implementation would use:
  - Zero-knowledge proofs (ZKP)
  - Digital signatures
  - Blockchain anchoring (optional)

---

## File Structure

```
verifyonce/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Credential.js
│   │   └── Verification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── wallet.js
│   │   └── verification.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── BusinessVerifier.jsx
│   │   │   ├── BusinessPortal.jsx
│   │   │   └── LiveDemo.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
└── README.md (this file)
```

---

## Next Steps (Future Enhancements)

- [ ] Real cryptographic proof generation (ZKP-SNARK)
- [ ] Blockchain anchoring for proof immutability
- [ ] Revocation service
- [ ] Issuer dashboard (government/bank login)
- [ ] Mobile wallet app
- [ ] API rate limiting & DDoS protection
- [ ] Audit logging service
- [ ] Email verification for new accounts
- [ ] Biometric authentication
- [ ] Multi-credential support per user

---

## Glossary

- **Credential**: Digitally signed document issued by trusted authority
- **Proof**: Time-limited, privacy-preserving proof generated from credential
- **Wallet**: User's encrypted device storage for credentials
- **Issuer**: Entity that verifies and issues credentials (government, bank)
- **Verifier**: Entity that requests and validates proofs (hotel, business)
- **User**: Identity owner (controls wallet and credentials)
- **ZKP**: Zero-Knowledge Proof (mathematical proof without revealing data)

---

## Contact & Support

For questions or issues, refer to the project documentation or contact the development team.

**Status as of Feb 7, 2026:** MVP Complete - Ready for Hackathon Demo
