# Quick Reference - Code Snippets for Testing

## Backend Changes Summary

### File 1: backend/routes/credentials.js (NEW)
**Status**: Created ✅
**Key Exports**: Router with POST /create, GET /

### File 2: backend/server.js (UPDATED)
**Changes**:
```javascript
// Added these lines:
const credentialsRoutes = require('./routes/credentials');
app.use('/api/credentials', credentialsRoutes);
app.use('/api/verifications', verificationRoutes); // Alias
```

### File 3: backend/routes/verification.js (UPDATED)
**POST /approve/:requestId Changes**:
```javascript
// Now requires credentialId in body
// Added field validation loop
// Returns 400 if fields missing
```

---

## Frontend Changes Summary

### File: frontend/src/pages/UserDashboard.jsx (MAJOR UPDATE)

#### 1. Added State Variable
```javascript
const [selectedCredentialId, setSelectedCredentialId] = useState(null);
```

#### 2. Updated fetchCredentials()
```javascript
// Changed from: `/api/wallet/credentials`
// Changed to: `/api/credentials`
```

#### 3. Updated approve() Function
```javascript
// Added before API call:
if (!selectedCredentialId) {
  setError('Please select a credential');
  return;
}

// Now sends:
{ credentialId: selectedCredentialId }
```

#### 4. Credential Selector UI (Added)
```javascript
// Dropdown showing all credentials
<select
  value={selectedCredentialId || ''}
  onChange={(e) => setSelectedCredentialId(e.target.value)}
>
  <option value="">-- Select a credential --</option>
  {credentials.map(cred => (
    <option key={cred._id} value={cred._id}>
      {cred.type}: {cred.issuer}
    </option>
  ))}
</select>
```

---

## Quick Test Scenarios

### Scenario 1: Happy Path - Successful Approval
```
1. Create credential with: fullName, DOB, nationality, Aadhaar, address
2. Verify in vault grid
3. Create verifier request asking for: age, nationality
4. Submit request code
5. See credential dropdown
6. Select credential
7. Click Approve
8. ✅ Success - Proof generated
```

### Scenario 2: Validation Failure - Missing Fields
```
1. Create credential with: fullName, DOB only (no nationality, no address)
2. Create verifier request asking for: nationality, address
3. Submit request code
4. Select credential
5. Click Approve
6. ❌ Error: "missing required fields: nationality, address"
7. Must select different credential or reject request
```

### Scenario 3: No Credential Selected
```
1. Have credentials in vault
2. Submit request code
3. See dropdown with credentials
4. DON'T select anything
5. Click Approve
6. ❌ Error: "Please select a credential"
7. Must select before proceeding
```

### Scenario 4: No Credentials Available
```
1. No credentials created yet
2. Submit request code
3. See warning: "You don't have any credentials yet"
4. See button "Add New Credential"
5. Click button to create credential
```

---

## Field Validation Matrix

| Request Field | Credential Field | Error Message If Missing |
|---|---|---|
| age | dateOfBirth | "date of birth (needed for age verification)" |
| nationality | nationality | "nationality" |
| fullName | fullName | "full name" |
| address | address | "address" |
| identity | aadhaarNumber | "identity information" |

**Rule**: Request asks for "age" → Check credential.data.dateOfBirth exists

---

## Common Issues & Quick Fixes

### Issue: Dropdown Empty
**Fix**: 
```
1. Check backend running (npm start)
2. Create credential with all fields
3. Refresh browser (Ctrl+R or F5)
4. Dropdown should show credential
```

### Issue: Approval Fails with Field Error
**Fix**:
```
For "missing dateOfBirth (needed for age verification)":
- Create new credential
- Ensure Date of Birth is filled (required field)
- Use new credential

For "missing nationality":
- Must select nationality when creating credential
- Create new credential with nationality selected

For "missing address":
- Address field must be filled
- Create new credential with address filled
```

### Issue: Form Not Resetting
**Fix**:
```
Manually clear fields and try again:
1. Delete credential from vault (when implemented)
2. Refresh page
3. Or close dashboard and reopen
```

### Issue: "Please select a credential" error
**Fix**:
```
This means you didn't select from dropdown
1. Open request code properly
2. Click dropdown
3. Select a credential (required)
4. Then click Approve
```

---

## Verification Checklist

Before Testing:

- [ ] `npm start` in backend folder
- [ ] `npm run dev` in frontend folder
- [ ] Browser shows no red errors in console
- [ ] Can login successfully
- [ ] Dashboard loads

Testing Credential Creation:

- [ ] Navigate to "Add Credential" section
- [ ] Fill ALL fields:
  - Credential Type: government_id
  - Full Name: John Doe
  - Date of Birth: 1990-01-15
  - Nationality: Indian
  - Last 4 Aadhaar: 5678
  - Address: 123 Main St, New Delhi
- [ ] Click "Create Credential"
- [ ] See success message
- [ ] Navigate to "Credentials" tab
- [ ] See credential in grid with correct info

Testing Credential Selection:

- [ ] Login as verifier
- [ ] Create request asking for: age, nationality
- [ ] Get request code (e.g., VF-ABC123)
- [ ] Note the 5-minute timer
- [ ] Login as user (separate tab/incognito)
- [ ] Go to dashboard
- [ ] Paste request code
- [ ] Click submit
- [ ] See request details
- [ ] See credential dropdown
- [ ] Verify dropdown shows created credential
- [ ] Select credential from dropdown
- [ ] See confirmation message
- [ ] Click Approve

Testing Error Handling:

- [ ] Try approve WITHOUT selecting credential
- [ ] Should see error: "Please select a credential"
- [ ] Create credential missing address
- [ ] Create verifier request asking for address
- [ ] Try approve with credential lacking address
- [ ] Should see error: "missing required fields: address"
- [ ] Create new credential WITH address
- [ ] Try approve again
- [ ] Should succeed this time

---

## Database Verification Commands

### Connect to MongoDB
```bash
# Windows PowerShell
mongosh

# Or
mongo
```

### Check Credentials Created
```javascript
use verifyonce
db.credentials.find({}).pretty()

// Should see something like:
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  type: "government_id",
  issuer: "VerifyOnce Authority",
  data: {
    fullName: "John Doe",
    dateOfBirth: ISODate("1990-01-15"),
    nationality: "Indian",
    aadhaarNumber: "****5678",
    address: "123 Main St"
  },
  isActive: true,
  validUntil: ISODate("2027-02-14"),
  createdAt: ISODate("2026-02-14")
}
```

### Check Specific User's Credentials
```javascript
// Find your user ID first
db.users.findOne({ email: "your@email.com" })
// Copy the _id

// Then find credentials
db.credentials.find({ userId: ObjectId("your_user_id") }).pretty()
```

### Check Proofs Created
```javascript
db.proofs.find({}).pretty()

// Should see:
{
  proofId: "PROOF-ABC123DEF456",
  verificationId: ObjectId("..."),
  sharedData: {
    ageVerified: true,
    age: 36,
    nationality: "Indian"
    // Note: NO dateOfBirth or other unrequested fields
  },
  expiresAt: ISODate("2026-02-14T10:45:00Z"),
  createdAt: ISODate("2026-02-14T10:42:00Z")
}
```

---

## Network Debugging

### Open Browser DevTools
- Press: F12 or Ctrl+Shift+I
- Go to: Network tab
- Filter by: XHR (XmlHttpRequest)

### What to Look For

**When Creating Credential**:
```
POST /api/credentials/create

Request Headers:
Authorization: Bearer eyJhbG...

Request Body:
{
  type: "government_id",
  fullName: "John Doe",
  dateOfBirth: "1990-01-15",
  ...
}

Response Status: 200
Response Body:
{
  success: true,
  credential: { _id, type, issuer, ... }
}
```

**When Fetching Credentials for Dropdown**:
```
GET /api/credentials

Response Status: 200
Response Body:
{
  success: true,
  credentials: [
    { _id, type, issuer, fullName, ... }
  ]
}
```

**When Approving Request**:
```
POST /api/verification/approve/VF-ABC123

Request Body:
{
  credentialId: "507f1f77bcf86cd799439011"
}

Success Response (Status 200):
{
  success: true,
  proof: {
    proofId: "PROOF-...",
    sharedData: { age: 36, nationality: "Indian" }
  }
}

Error Response (Status 400):
{
  success: false,
  message: "This credential is missing required fields: address"
}
```

---

## Browser Console Testing

### Check Credentials State
```javascript
// In browser console when dashboard is open:
localStorage.getItem('user') // Check logged-in user
// Should show: { id, name, email, role }

// Check if credentials loaded
// (This varies depending on component structure, but general idea:)
console.log(credentials) // Should show array
console.log(selectedCredentialId) // Should show selected ID or null
```

### Make Direct API Call (for debugging)
```javascript
// In browser console:
const token = JSON.parse(localStorage.getItem('user')).token;

// Test credentials endpoint
fetch('http://localhost:5000/api/credentials', {
  headers: { Authorization: `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log(d))

// Test approve endpoint
fetch('http://localhost:5000/api/verification/approve/REQUEST_ID', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ credentialId: 'CREDENTIAL_ID' })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## Environment Setup Verification

### Backend Ready?
```bash
cd backend
npm start

# Should see:
Server running on port 5000
MongoDB connected to verifyonce
```

### Frontend Ready?
```bash
cd frontend
npm run dev

# Should see:
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### Can Access Frontend?
```
Open browser: http://localhost:5173
Should see VerifyOnce landing page
```

### Can Login?
```
1. Go to signup
2. Create account
3. Login with created account
4. Should see dashboard
```

### Can See Credentials Tab?
```
After login:
1. Dashboard should load
2. Should see tabs: Requests, Credentials, Add Credential
3. "Credentials" tab might say "No Credentials Yet"
```

### Can Create Credential?
```
1. Go to "Add Credential" tab
2. Fill all fields
3. Click "Create Credential"
4. Should see success message
5. Credential should appear in "Credentials" tab
```

---

## Success Indicators

### ✅ System Working Correctly When:
- [x] Credentials created and stored in database
- [x] Credential dropdown shows created credentials
- [x] Approval fails with clear field error if fields missing
- [x] Approval succeeds when all fields present
- [x] Proof generated with only requested fields
- [x] No errors in browser console
- [x] No network errors in DevTools Network tab
- [x] Database shows credentials and proofs

### ❌ System Has Issues When:
- [ ] Dropdown stays empty after creating credential
- [ ] "Please select a credential" error prevents approval
- [ ] Approval fails with cryptic error message
- [ ] Proof doesn't generate after approval
- [ ] Unrequested fields appear in proof
- [ ] Red errors in browser console
- [ ] Network tab shows 500 errors
- [ ] Database has no credentials or proofs

---

## Contact Points for Help

### If Dropdown Empty:
1. Check backend running
2. Verify credential in database:
   ```javascript
   db.credentials.find({}).pretty()
   ```
3. Create credential with ALL fields
4. Refresh browser

### If Approval Fails:
1. Check error message in frontend and backend logs
2. If "missing required fields": Create credential with those fields
3. Check database credential has all fields:
   ```javascript
   db.credentials.findOne({_id: ObjectId("...")}).pretty()
   ```

### If Credentials Tab Shows No Credentials:
1. Verify credentials exist in database
2. Check API returns data: Network tab → GET /api/credentials → Response
3. Check browser console for JavaScript errors
4. Refresh page

### If Form Not Resetting After Creation:
1. Success message should appear (check browser)
2. Manual workaround: Refresh page with Ctrl+R
3. Check backend logs for errors during POST /create

---

## Template: Copy & Paste Fixes

### Fix 1: Create Working Test Credential
```javascript
// Email and password to test with - adjust as needed:
// Email: testuser@example.com
// Password: TestPass123

// When creating credential, use these values:
Full Name: John Doe
Date of Birth: 1990-01-15
Nationality: Indian
Last 4 Aadhaar: 5678
Address: 123 Main Street, New Delhi, India 110001
```

### Fix 2: Common Error Responses
```
Error: "Please select a credential"
Fix: Click dropdown and select from list

Error: "This credential is missing required fields: date of birth"
Fix: Create new credential with Date of Birth field filled

Error: "Unauthorized"
Fix: Log out, clear browser cache, log back in

Error: Request not found or has expired
Fix: Get new request code (old one expired after 5 minutes)
```

### Fix 3: Reset to Clean State
```bash
# 1. Clear frontend cache
# In browser: Ctrl+Shift+Delete (Delete browsing data)
# Close browser completely
# Reopen

# 2. Restart backend
# In terminal: Ctrl+C to stop
# Then: npm start

# 3. Restart frontend
# In terminal: Ctrl+C to stop
# Then: npm run dev

# 4. Login again fresh
```
