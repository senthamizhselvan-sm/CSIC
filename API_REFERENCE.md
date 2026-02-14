# API Reference - Credential Selection Implementation

## Complete API Endpoint Reference

### Credentials Management

#### 1. Create New Credential
```
METHOD: POST
URL: /api/credentials/create
Auth: Required (JWT Bearer token)

REQUEST BODY:
{
  "type": "government_id",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "nationality": "Indian",
  "aadhaarLast4": "5678",
  "address": "123 Main St, New Delhi, India"
}

SUCCESS RESPONSE (200):
{
  "success": true,
  "message": "Credential created successfully",
  "credential": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "type": "government_id",
    "issuer": "VerifyOnce Authority",
    "data": {
      "fullName": "John Doe",
      "dateOfBirth": "1990-01-15",
      "nationality": "Indian",
      "aadhaarNumber": "****5678",
      "address": "123 Main St, New Delhi, India"
    },
    "verifiedAt": "2026-02-14T10:30:00Z",
    "validUntil": "2027-02-14T10:30:00Z",
    "isActive": true,
    "createdAt": "2026-02-14T10:30:00Z"
  }
}

ERROR RESPONSES:
- 400: "Full name and date of birth are required"
- 400: "Date of birth must be in the past"
- 400: "You already have an active credential. Please revoke it first."
- 401: "Unauthorized"
- 500: "Error creating credential"
```

#### 2. List All User Credentials
```
METHOD: GET
URL: /api/credentials
Auth: Required (JWT Bearer token)
Query Params: None

SUCCESS RESPONSE (200):
{
  "success": true,
  "credentials": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "government_id",
      "issuer": "VerifyOnce Authority",
      "fullName": "John Doe",
      "nationality": "Indian",
      "dateOfBirth": "Present",           // Just flag, not actual value
      "address": "Present",               // Just flag, not actual value
      "verifiedAt": "2026-02-14T10:30:00Z",
      "validUntil": "2027-02-14T10:30:00Z",
      "isActive": true
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "type": "passport",
      "issuer": "Ministry of External Affairs",
      "fullName": "John Doe",
      "nationality": "Indian",
      "dateOfBirth": "Present",
      "address": "Absent",                // Address was not filled
      "verifiedAt": "2026-01-10T08:00:00Z",
      "validUntil": "2031-01-10T08:00:00Z",
      "isActive": false                   // Expired or revoked
    }
  ]
}

ERROR RESPONSES:
- 401: "Unauthorized"
- 500: "Error fetching credentials"

USAGE: Populate dropdown for credential selection
```

#### 3. Get Single Active Credential
```
METHOD: GET
URL: /api/credentials/my-credential
Auth: Required (JWT Bearer token)

SUCCESS RESPONSE (200):
{
  "success": true,
  "credential": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "government_id",
    "issuer": "VerifyOnce Authority",
    "fullName": "John Doe",
    "nationality": "Indian",
    "validUntil": "2027-02-14T10:30:00Z",
    "isActive": true
  }
}

ERROR RESPONSES:
- 404: "No active credential found"
- 401: "Unauthorized"

USAGE: Quick credential status check
```

---

### Verification & Approval

#### 4. Get Request Details by Code
```
METHOD: GET
URL: /api/verification/request/{requestCode}
Auth: Required (JWT Bearer token)

RESPONSE (200):
{
  "success": true,
  "verification": {
    "requestId": "507f1f77bcf86cd799439013",
    "verifierId": "507f1f77bcf86cd799439014",
    "verifierName": "Hotel Grand Palace",
    "requestedData": ["age", "nationality"],
    "status": "pending",
    "expiresAt": "2026-02-14T10:40:00Z",
    "expiresInMinutes": 3
  }
}

ERROR RESPONSES:
- 404: "Request not found or has expired"
- 400: "Invalid request code format"
- 401: "Unauthorized"
```

#### 5. Approve Request with Credential Selection (CRITICAL)
```
METHOD: POST
URL: /api/verification/approve/{requestId}
Auth: Required (JWT Bearer token)

REQUEST BODY (IMPORTANT - credentialId REQUIRED):
{
  "credentialId": "507f1f77bcf86cd799439011"
}

SUCCESS RESPONSE (200):
{
  "success": true,
  "message": "Verification approved successfully",
  "proof": {
    "proofId": "PROOF-ABC123DEF456",
    "verificationId": "507f1f77bcf86cd799439013",
    "sharedData": {
      "ageVerified": true,
      "age": 36,
      "nationality": "Indian"
    },
    "expiresAt": "2026-02-14T10:45:00Z"
  }
}

⚠️ ERROR RESPONSES (Important - Field Validation):

1. Missing Credential Selection:
- 400: "Credential ID is required"

2. Credential Not Found:
- 404: "Credential not found"

3. Credential Expired:
- 400: "Your credential has expired"

4. **Credentials Missing Fields** (KEY VALIDATION):
- 400: "This credential is missing required fields: date of birth (needed for age verification), nationality"
- 400: "This credential is missing required fields: address"
- 400: "This credential is missing required fields: identity information"

5. Request Issues:
- 404: "Request not found"
- 400: "Request has already been processed"
- 400: "Request has expired"

6. Auth:
- 401: "Unauthorized"

EXAMPLE VALIDATION ERRORS:
Request asks for: ["age", "nationality"]
Credential has: [fullName, aadhaar] (missing DOB and nationality)
Response: 400 "This credential is missing required fields: date of birth (needed for age verification), nationality"

Request asks for: ["address"]
Credential has: [fullName, DOB, nationality] (no address)
Response: 400 "This credential is missing required fields: address"

FIELD VALIDATION LOGIC:
age → requires dateOfBirth
nationality → requires nationality
fullName → requires fullName
address → requires address
identity → requires aadhaarNumber
```

#### 6. Reject Request
```
METHOD: POST
URL: /api/verification/reject/{requestId}
Auth: Required (JWT Bearer token)

REQUEST BODY:
{
  "reason": "Optional reason for rejection"
}

SUCCESS RESPONSE (200):
{
  "success": true,
  "message": "Request rejected successfully",
  "verification": {
    "requestId": "507f1f77bcf86cd799439013",
    "status": "rejected",
    "rejectedAt": "2026-02-14T10:35:00Z"
  }
}

ERROR RESPONSES:
- 404: "Request not found"
- 400: "Request already processed"
- 401: "Unauthorized"
```

---

## Frontend Call Examples

### React/Axios Implementation

#### Fetch Credentials for Dropdown
```javascript
const fetchCredentials = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/credentials`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      setCredentials(response.data.credentials || []);
      console.log('Credentials loaded:', response.data.credentials);
    }
  } catch (error) {
    console.error('Failed to fetch credentials:', error.response?.data);
    setError('Failed to load credentials');
  }
};
```

#### Create New Credential
```javascript
const submitCredential = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/credentials/create`,
      {
        type: credentialForm.type,
        fullName: credentialForm.fullName,
        dateOfBirth: credentialForm.dateOfBirth,
        nationality: credentialForm.nationality,
        aadhaarLast4: credentialForm.aadhaarLast4,
        address: credentialForm.address
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      setMessage('Credential created successfully!');
      // Refresh credentials list
      fetchCredentials(token);
      // Reset form
      resetForm();
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to create credential');
  }
};
```

#### Approve Request with Credential (KEY - Must Include credentialId)
```javascript
const approve = async (requestId) => {
  // CRITICAL: Check credential selected
  if (!selectedCredentialId) {
    setError('Please select a credential to use for verification');
    return;
  }
  
  try {
    // CRITICAL: Send credentialId in body
    const response = await axios.post(
      `${API_URL}/api/verification/approve/${requestId}`,
      {
        credentialId: selectedCredentialId  // MUST include this
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      setMessage('Verification approved successfully!');
      setProof(response.data.proof);
      // Reset for next request
      setSelectedCredentialId(null);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    
    // Handle validation error differently
    if (error.response?.status === 400) {
      if (errorMsg?.includes('missing required fields')) {
        setError(`⚠️ ${errorMsg}\n\nPlease select a different credential or create a new one.`);
      } else {
        setError(errorMsg);
      }
    } else {
      setError('Failed to approve request');
    }
    
    console.error('Approval error:', error.response?.data);
  }
};
```

---

## Common Request/Response Flows

### Happy Path: Successful Approval
```
1. User logs in
   ↓ Frontend stores JWT token
   
2. Navigate to request approval
   GET /api/verification/request/{code}
   ← Returns request details with requestedData: ["age"]
   
3. Fetch credentials for dropdown
   GET /api/credentials
   ← Returns [{ _id: "123", fullName: "John", dateOfBirth: "Present", ... }]
   
4. User selects credential from dropdown
   → Frontend state: selectedCredentialId = "123"
   
5. User clicks Approve
   POST /api/verification/approve/{requestId}
   Body: { credentialId: "123" }
   
6. Backend validates:
   - Credential exists? YES
   - Credential active? YES
   - Credential not expired? YES
   - Has dateOfBirth? YES (for 'age' request)
   
   ← Returns 200: { success: true, proof: { ... } }
   
7. Frontend shows success
   "✅ Verification approved! Proof ID: PROOF-ABC123"
```

### Error Path: Missing Fields
```
1. Same steps 1-4 above
   
2. Credential has: [fullName, aadhaar]
   Request asks for: [age, nationality]
   
3. User clicks Approve
   POST /api/verification/approve/{requestId}
   Body: { credentialId: "123" }
   
4. Backend validation:
   - Credential exists? YES
   - Credential active? YES
   - Credential not expired? YES
   - Has dateOfBirth? NO ← MISSING
   - Has nationality? NO ← MISSING
   
   ← Returns 400: {
     success: false,
     message: "This credential is missing required fields: date of birth (needed for age verification), nationality"
   }
   
5. Frontend shows error
   "⚠️ This credential is missing required fields: date of birth (needed for age verification), nationality"
   
6. User options:
   a) Select different credential
   b) Create new credential with those fields
   c) Reject request
```

### Error Path: No Credential Selected
```
1. User navigates to request approval
2. Sees credential dropdown
3. Does NOT select a credential (leaves as "-- Select credential --")
4. Clicks Approve button
5. Frontend validation:
   selectedCredentialId == null?
   YES → Show error: "Please select a credential"
   → Do NOT send API request
6. User must select before proceeding
```

---

## Status Codes Quick Reference

```
✅ 200 OK
- Credential created successfully
- Credentials fetched successfully
- Request details loaded
- Request approved successfully
- Request rejected successfully

❌ 400 Bad Request
- Missing required fields in credential creation
- Credential missing fields for approval
- Invalid request format
- Request already processed
- Request expired

❌ 401 Unauthorized
- Missing or invalid JWT token
- Session expired
- Not authenticated

❌ 404 Not Found
- Credential not found
- Request not found
- No active credential exists

❌ 500 Internal Server Error
- Database error
- Server error
- Unexpected backend issue
```

---

## Debugging: Check What Data Backend Has

### MongoDB Queries

**Check all credentials for user:**
```javascript
db.credentials.find({ userId: ObjectId("...") }).pretty()
```

**Check specific credential:**
```javascript
db.credentials.findOne({ 
  _id: ObjectId("507f1f77bcf86cd799439011")
}).pretty()
```

**Check verification requests:**
```javascript
db.verifications.find({ status: "pending" }).pretty()
```

**Check if proof was created:**
```javascript
db.proofs.findOne({ proofId: "PROOF-ABC123" }).pretty()
```

---

## Test Cases with Exact URLs

### Test 1: Create Credential
```bash
curl -X POST http://localhost:5000/api/credentials/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "government_id",
    "fullName": "Test User",
    "dateOfBirth": "1990-01-15",
    "nationality": "Indian",
    "aadhaarLast4": "1234",
    "address": "123 Test St"
  }'
```

### Test 2: List Credentials
```bash
curl http://localhost:5000/api/credentials \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Approve with Valid Credential
```bash
curl -X POST http://localhost:5000/api/verification/approve/VERIFICATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "credentialId": "CREDENTIAL_ID"
  }'
```

### Test 4: Approve without Credential ID (should fail)
```bash
curl -X POST http://localhost:5000/api/verification/approve/VERIFICATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
  
# Expected: 400 "Credential ID is required"
```

### Test 5: Approve with Invalid Credential ID
```bash
curl -X POST http://localhost:5000/api/verification/approve/VERIFICATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "credentialId": "invalid_id_123"
  }'
  
# Expected: 404 "Credential not found"
```

---

## Key Integration Points

### Frontend → Backend Communication

1. **Credentials Dropdown Population**
   - Frontend: GET /api/credentials
   - Backend returns: Array of credentials with minimal sensitive data
   - Frontend renders: Dropdown with type, issuer, fullName

2. **Credential Selection**
   - Frontend tracks: selectedCredentialId state
   - User selects from dropdown
   - State updated with credential._id

3. **Approval with Validation**
   - Frontend: POST /api/verification/approve/{requestId} + { credentialId }
   - Backend: Validates credential has all requestedData fields
   - Returns: Success with proof OR 400 error with missing fields list

4. **Error Handling**
   - Frontend checks error.response.status === 400
   - If includes "missing required fields": Show special error message
   - Suggest creating new credential or selecting different one

---

## Performance Notes

**Credential List Endpoint (GET /api/credentials)**
- Excludes sensitive data (full Aadhaar, DOB values)
- Returns "Present"/"Absent" flags for optional fields
- Suitable for showing in UI without privacy concerns

**Approval Endpoint (POST /approve/{requestId})**
- Validates credential exists (DB query)
- Validates field presence (in-memory loop)
- Creates proof document
- Expected response time: <500ms

**Proof Generation**
- Creates minimal shared data (only requested fields)
- Expires in 3 minutes
- Privacy-preserving design
