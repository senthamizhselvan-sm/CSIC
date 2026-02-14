# Verification Request Flow - Complete Guide

## Overview
This document describes the complete flow of the verification request system where a **Verifier (Business)** creates a request and a **User** approves it, leading to the Verifier seeing the User's details with the request status.

---

## Complete Flow

### Step 1: Verifier Creates Request (Verifier Dashboard)
**Location:** BusinessPortal.jsx → RequestBuilder Component
- Verifier fills in the request details:
  - Business Name
  - Requested Data (Age, Nationality, etc.)
  - Validity/Expiry Time
  - Purpose
- Backend generates a unique **Request Code** (e.g., `VF-QWCZM2`)
- Verifier receives QR code and request code

**Backend Endpoint:** `POST /api/verification/request`
```json
Response:
{
  "requestId": "VF-QWCZM2",
  "expiresAt": "2026-02-13T10:30:00Z",
  "qrData": {...},
  "message": "Verification request created successfully"
}
```

---

### Step 2: User Receives & Reviews Request (User Dashboard)
**Location:** UserDashboard.jsx → "🔵 VERIFY REQUEST" Section
- User enters the verification code shown by the Verifier
- System fetches request details showing:
  - Verifier Name
  - Requested Data
  - Expiry Time
  - What will NOT be shared (privacy info)

**Backend Endpoint:** `GET /api/verification/request/{requestCode}`
```json
Response:
{
  "requestId": "VF-QWCZM2",
  "businessName": "Grand Hotel Mumbai",
  "purpose": "Guest Check-in",
  "requestedData": [
    { "field": "age", "type": "verification_only" },
    { "field": "nationality", "type": "full" }
  ],
  "expiresAt": "2026-02-13T10:30:00Z"
}
```

---

### Step 3: User Approves/Denies Request
**Location:** UserDashboard.jsx → Approval Actions

#### Option A: Approve Request
- User clicks **"✅ Approve"** button
- System:
  - Fetches user's active credential
  - Extracts only requested data (with privacy preserved)
  - Generates cryptographic proof
  - Updates request status to "approved"
  - Sends proof to Verifier via Socket.io

**Backend Endpoint:** `POST /api/verification/approve/{requestCode}`
```json
Response:
{
  "success": true,
  "message": "Verification approved successfully",
  "proofId": "proof-abc123xyz",
  "sharedData": {
    "ageVerified": true,
    "ageRange": "21+",
    "nationality": "Indian"
  },
  "cryptographicProof": "...",
  "blockchainTxId": "#TX123456"
}
```

#### Option B: Deny Request
- User clicks **"❌ Reject"** button
- System:
  - Updates request status to "denied"
  - Notifies Verifier
  - Request ends

**Backend Endpoint:** `POST /api/verification/deny/{requestCode}`

---

### Step 4: Verifier Checks Request Status (Verifier Dashboard)
**Location:** BusinessPortal.jsx → "Verify Request Code" / "Check Status" Sections

#### Checking Status
- Verifier enters the request code to check status
- System returns current status: pending, approved, denied, expired, revoked

**Backend Endpoint:** `GET /api/verification/status/{requestCode}`
```json
Response (Approved):
{
  "requestId": "VF-QWCZM2",
  "status": "approved",
  "sharedData": {
    "ageVerified": true,
    "ageRange": "21+",
    "nationality": "Indian"
  },
  "proofId": "proof-abc123xyz",
  "proofExpiresAt": "2026-02-13T10:35:00Z"
}
```

---

### Step 5: Verifier Views User Profile & Details
**NEW FEATURE:** Shows User Information with Request Status
**Location:** BusinessPortal.jsx → VerifyRequestCode Component

When request is **APPROVED**, Verifier can view complete user profile:
- User Name
- Email Address
- Phone Number
- Member Since (Join Date)
- Credential Status
- All Shared Data
- Cryptographic Proof Details

**Backend Endpoint:** `GET /api/verification/user-details/{requestCode}`
```json
Response:
{
  "requestId": "VF-QWCZM2",
  "status": "approved",
  "businessName": "Grand Hotel Mumbai",
  "purpose": "Guest Check-in",
  
  // User Profile Information
  "userProfile": {
    "userId": "user_123",
    "name": "Jameen Khan",
    "email": "jameen@example.com",
    "phone": "+91-9876543210",
    "joinedDate": "2025-12-15T10:00:00Z",
    "hasCredential": true,
    "credentialType": "government_id",
    "credentialIssuer": "DigiLocker"
  },
  
  // Shared Data (User approved)
  "sharedData": {
    "ageVerified": true,
    "ageRange": "21+",
    "nationality": "Indian"
  },
  
  // Cryptographic Proof
  "proofId": "proof-abc123xyz",
  "cryptographicProof": "...",
  "blockchainTxId": "#TX123456",
  "proofExpiresAt": "2026-02-13T10:35:00Z",
  "timeRemaining": 300000 // milliseconds
}
```

---

## UI Components

### User Dashboard (UserDashboard.jsx)

#### 1. Quick Verification Box (Top of Dashboard)
```
┌─────────────────────────────────────────────┐
│ 🔵 VERIFY REQUEST                          │
├─────────────────────────────────────────────┤
│ Enter request code: [VF-QWCZM2]  [✓ Approve]
│ ✅ Request Approved! Proof shared.          │
└─────────────────────────────────────────────┘
```

#### 2. Live Verification Requests Section
- Shows all pending verification requests from verifiers
- Each request displays:
  - Verifier Name & Logo
  - Request Code
  - Requested Data
  - Time Remaining
  - Action Buttons: [View Details] [Reject] [Approve]

#### 3. Verification History
- Shows all past verification attempts
- Status: Approved, Rejected, Expired, Revoked

---

### Verifier Dashboard (BusinessPortal.jsx → VerifyRequestCode Component)

#### 1. Request Code Input
```
┌─────────────────────────────────────────────┐
│ 📝 Verify Request Code                      │
├─────────────────────────────────────────────┤
│ Request Code (e.g., VF-QWCZM2):             │
│ [VF-QWCZM2]                      [🔍 Check] │
│ ✅ Request APPROVED!                        │
└─────────────────────────────────────────────┘
```

#### 2. Results Display - User Profile Section
When Request is APPROVED:
```
┌──────────────────────────────────────────────────┐
│ ✅ APPROVED                                      │
├──────────────────────────────────────────────────┤
│ 👤 CUSTOMER PROFILE                              │
│ ├─ Name: Jameen Khan                            │
│ ├─ Email: jameen@example.com                    │
│ ├─ Phone: +91-9876543210                        │
│ ├─ Member Since: Dec 15, 2025                   │
│ └─ Credential: ✓ government_id                  │
│                                                  │
│ ✅ DATA RECEIVED FROM CUSTOMER                   │
│ ├─ Age Verified: ✓ YES                          │
│ ├─ Age Range: 21+                               │
│ └─ Nationality: Indian                          │
│                                                  │
│ 🔐 CRYPTOGRAPHIC PROOF                           │
│ ├─ Proof ID: proof-abc123xyz                    │
│ ├─ Blockchain TX: #TX123456                     │
│ └─ Nonce: a1b2c3d4e5f6g7h8                      │
└──────────────────────────────────────────────────┘
```

---

## Data Privacy & Security

### What Gets Shared
- **Age Verification:** Only YES/NO, never actual birthdate
- **Age Range:** "21+", "18+", or "under-18"
- **Nationality:** If requested
- **Name:** Only if explicitly requested for full disclosure
- **No ID Numbers:** ID numbers are NEVER shared
- **No Birthdate:** Exact birthdate is NEVER shared

### What Gets Encrypted
- Cryptographic Proof: SHA-256 hash
- Nonce: For replay protection
- Proof Validity: Time-limited (default 5 minutes)

---

## Request Status States

| Status | Description | User Action | Verifier Sees |
|--------|-------------|-------------|------|
| `pending` | Waiting for user approval | Needs to approve/reject | ⏳ Waiting for approval |
| `approved` | User approved | Data shared | ✅ Shared data & proof |
| `denied` | User rejected | Request ends | ❌ Rejected |
| `expired` | Time limit exceeded | Request invalid | ⏱️ Expired |
| `revoked` | User revoked approved proof | Proof invalidated | 🚫 Revoked |

---

## Backend Endpoints Summary

### For Users
- `GET /api/verification/request/{requestCode}` - Get request details for review
- `POST /api/verification/approve/{requestCode}` - Approve request
- `POST /api/verification/deny/{requestCode}` - Deny request
- `POST /api/verification/revoke/{requestCode}` - Revoke approved proof
- `GET /api/verification/history` - Get verification history

### For Verifiers (Business)
- `POST /api/verification/request` - Create new verification request
- `GET /api/verification/status/{requestCode}` - Check request status
- `GET /api/verification/user-details/{requestCode}` - Get user profile & details (NEW)

---

## Frontend Components

### User Side
- **UserDashboard.jsx**
  - Quick approval box
  - Pending requests display
  - History section
  - Functions: `approve()`, `deny()`, `fetchVerificationHistory()`

### Verifier Side
- **BusinessPortal.jsx** (Main)
  - Navigation to verification sections
  - Tab switching

- **VerifyRequestCode.jsx** (Display)
  - Request code input
  - Status checker
  - User profile display (NEW)
  - Shared data display
  - Proof information display

---

## Example Workflow

1. **Grand Hotel Mumbai** creates verification request for "Guest Check-in"
   - Request Code: `VF-QWCZM2`
   - Requests: Age (18+), Nationality
   - Valid for: 5 minutes

2. **Jameen** sees notification on User Dashboard
   - Enters code: `VF-QWCZM2`
   - Reviews request details
   - Clicks **Approve**

3. **System processes approval**
   - Fetches Jameen's credentials
   - Shares: Age Verified (YES), Age Range (21+), Nationality (Indian)
   - Generates cryptographic proof
   - Sends to Grand Hotel

4. **Grand Hotel** checks status
   - Enters code: `VF-QWCZM2`
   - Sees: Request APPROVED
   - Views **Customer Profile:**
     - Name: Jameen Khan
     - Email: jameen@example.com
     - Member Since: Dec 15, 2025
   - Views **Shared Data:**
     - Age Verified: YES
     - Age Range: 21+
     - Nationality: Indian

---

## Future Enhancements

1. **Real-time Updates** - Socket.io notifications when status changes
2. **Bulk Requests** - Create multiple verification requests at once
3. **Request Templates** - Save common request combinations
4. **Advanced Filters** - Filter verification history by date, status, verifier
5. **Audit Logs** - Complete audit trail of all actions
6. **Analytics Dashboard** - Verifier insights on approval rates, response times
7. **Custom Workflows** - Define multi-step verification processes

