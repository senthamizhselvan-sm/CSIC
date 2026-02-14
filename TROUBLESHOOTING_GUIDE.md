# Troubleshooting Guide - Credential Selection Implementation

## Issue: Dropdown Not Showing Credentials

### Symptoms
- Request approval page shows dropdown but no options
- Empty state message: "-- Select a credential --" only shows placeholder
- No credentials appear in vault

### Root Causes & Solutions

#### 1. Backend Not Running or /api/credentials Endpoint Not Available
```
Error: Network error or 404 in console
```
**Fix:**
```bash
# Check if backend is running
cd backend
npm start

# Verify endpoint is accessible
curl http://localhost:5000/api/credentials
```

#### 2. No Credentials Created Yet
```
Symptoms: "No Credentials Yet" message in vault
```
**Fix:**
```
1. Go to "Add Your Identity Credential" tab
2. Fill in all fields: fullName, DOB, nationality, Aadhaar last 4, address
3. Click "Create Credential"
4. Wait for success message
5. Refresh browser or wait 2 seconds
6. Should appear in both vault AND dropdown
```

#### 3. Invalid Token/Not Authenticated
```
Error: 401 Unauthorized in network tab
```
**Fix:**
```
1. Log out completely
2. Clear browser cookies/local storage
3. Log back in
4. Token should be refreshed
```

#### 4. Credentials Exist But Dropdown Still Empty
```
Endpoint returns data but dropdown shows nothing
```
**Debug:**
```javascript
// Open browser DevTools → Console
// In UserDashboard, add logging:
const fetchCredentials = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/credentials`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Credentials fetched:", response.data); // ADD THIS
    setCredentials(response.data.credentials || []);
  } catch (error) {
    console.error("Fetch failed:", error.response?.data); // ADD THIS
  }
};
```

---

## Issue: Credential Selection Validation Failing

### Symptoms
- User selects credential but approval fails
- Error: "This credential is missing required fields: ..."

### Diagnosis

#### Check Which Fields Are Missing
```
Error message format:
"This credential is missing required fields: date of birth (needed for age verification), nationality"
```

**Debug - Check Backend Logs:**
```javascript
// In backend/routes/verification.js POST /approve/:requestId
// Add console.log before field validation:
console.log("Request requested data:", verification.requestedData);
console.log("Credential data:", credential.data);
console.log("Missing fields:", missingFields);
```

### Solutions

#### Solution 1: Credential Missing DOB (for age requests)
```
Error: "date of birth (needed for age verification)"

Fix:
1. Go to "Add Your Identity Credential"
2. Make sure Date of Birth is filled in (required)
3. Create new credential
4. Use new credential for approval
```

#### Solution 2: Credential Missing Nationality
```
Error: "nationality"

Fix:
1. When creating credential, ensure Nationality is selected
2. It's a required field (dropdown with only 2 options: Indian/Other)
3. Create new credential with nationality filled
```

#### Solution 3: Credential Missing Address
```
Error: "address"

Fix:
1. When creating credential, fill in Address field completely
2. Address is required for 'address' type verification requests
3. Try different credential if you have multiple
```

#### Solution 4: Credential Missing Aadhaar (for identity verification)
```
Error: "identity information"

Fix:
1. When creating credential, fill in "Last 4 digits of Aadhaar"
2. Identity verification requires this field
3. Use different credential if available
```

### Temporary Fix (for testing)
```
If you get this error repeatedly:
1. Go to "Add Your Identity Credential"
2. Create credential with ALL fields filled:
   - Full Name: John Doe
   - Date of Birth: 1990-01-15 (any past date)
   - Nationality: Indian
   - Last 4 Aadhaar: 1234
   - Address: 123 Main St, City, Country
3. This credential will work for ALL request types
```

---

## Issue: Form Not Resetting After Credential Creation

### Symptoms
- After creating credential, form still shows old data
- Need to manually clear fields
- Redirect to credentials tab not happening

### Root Causes & Solutions

#### Solution 1: JavaScript Error in submitCredential
```bash
# Check browser console for errors
# Should see: "Credential added successfully!" message
```

#### Solution 2: Manual Reset
```javascript
// In browser console:
// Reset form manually for testing
document.querySelector('input[name="fullName"]').value = '';
document.querySelector('input[name="dateOfBirth"]').value = '';
// etc...
```

#### Debug - Add Logging
```javascript
// In frontend/UserDashboard.jsx submitCredential():
const submitCredential = async () => {
  console.log("Form data before submit:", credentialForm);
  try {
    const response = await axios.post(
      `${API_URL}/api/credentials/create`,
      credentialForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Response:", response.data);
    if (response.data.success) {
      // Reset form
      console.log("Resetting form...");
      setCredentialForm({
        type: 'government_id',
        fullName: '',
        dateOfBirth: '',
        nationality: 'Indian',
        aadhaarLast4: '',
        address: ''
      });
      console.log("Form reset complete");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## Issue: Request Code Not Resolving

### Symptoms
- Enter request code → Nothing happens
- No error message
- Request details not loading

### Diagnosis

#### Check Request Code Format
```
Valid format: VF-XXXXXX (6 random characters)
Example: VF-ABC123

If you entered different format:
- Copy exact code from verifier dashboard
- Paste it (check for extra spaces)
```

#### Check Request Expired
```
Requests expire after 5 minutes

If request code works for verifier:
1. Check system time on both machines
2. Database server and client should have same time
3. If too much difference, requests might be treated as expired
```

#### Debug - Check Network
```javascript
// In browser DevTools → Network tab
// When you enter request code, should see:
GET /api/verification/request/{requestId}
Status: 200
Response: { ...request details... }

If 404:
- Request code doesn't exist
- Request already used/expired
- Verifier created request with different parameters
```

---

## Issue: Approval Succeeds But No Proof Generated

### Symptoms
- Approve button clicked → "Success!" message
- But no proof code appears
- Verifier can't check status

### Check Backend Logs
```bash
# Terminal where backend is running
# Should see logs like:
POST /api/verification/approve/VF-ABC123 200
Proof generated with ID: PROOF-...
```

### Debug - Check Database
```bash
# Connect to MongoDB
mongo
use verifyonce
# Check if proof was created
db.proofs.find({}).pretty()

# Should see proof document with sharedData containing requested fields only
```

### Potential Issues

#### Issue 1: Proof Model Not Defined
```
Error: Proof model not imported in verification.js

Fix: Check backend/models/Proof.js exists
And in verification.js:
const Proof = require('../models/Proof');
```

#### Issue 2: sharedData Calculation Wrong
```
Backend should ONLY include requested fields

Example: If request is for 'age':
- Include: { ageVerified: true, age: 28 }
- Exclude: DOB, nationality, address, aadhaar, etc.

Check backend/routes/verification.js calculateAge() logic
```

---

## Issue: Same Credential Works for Some Requests But Not Others

### Symptoms
- Credential A works for age verification
- Same credential A fails for nationality verification
- Error: "missing required fields: nationality"

### Root Cause
```
Credentials created at different times may have different data filled in
```

### Solution
```
Create new comprehensive credential with ALL fields:
1. Full Name: ✓
2. Date of Birth: ✓ (past date)
3. Nationality: ✓ (select from dropdown)
4. Aadhaar Last 4: ✓
5. Address: ✓

This credential works for ALL request types
```

### Verify Credential Data
```javascript
// In browser console after selecting credential:
console.log(credentials); // Should see all fields

// Expected output:
[{
  _id: "...",
  type: "government_id",
  fullName: "John Doe",           // ✓ Present
  nationality: "Indian",           // ✓ Present
  dateOfBirth: "1990-01-15",      // ✓ Present
  aadhaarNumber: "****1234",      // ✓ Present
  address: "123 Main St, City",   // ✓ Present
  isActive: true,
  validUntil: "2027-02-14"
}]
```

---

## Issue: Credential Shows as Inactive

### Symptoms
- Created credential appears in vault with "Inactive" status
- Can't select in dropdown
- Error when trying to use

### Root Causes

#### Cause 1: Credential Expired
```
Check: validUntil date

If current date > validUntil:
- Backend won't allow usage
- Fix: Create new credential (will have 1-year validUntil)

Current behavior:
- Credentials valid for 1 year from creation
- Backend checks: credential.validUntil > now()
```

#### Cause 2: isActive Flag Set to False
```
Backend set isActive: false during creation issue

Debug:
1. Go to MongoDB
   db.credentials.findOne({userId: "..."})
2. Check isActive field
3. If false, contact admin or check backend logs
```

#### Cause 3: Backend Credential Revocation (Future Feature)
```
Currently not implemented, but if added:
- User can mark credential as "revoked"
- Backend set isActive: false
- Credential appears but can't be used
```

---

## Issue: Multiple Users See Each Other's Credentials

### Symptoms
- User A logs in, sees credential from User B
- Security concern

### Root Cause Analysis
```
Verification flow:
1. Backend should fetch credentials with userId filter
2. Only return credentials where userId = req.user.id
```

### Check Backend Code
```javascript
// In backend/routes/credentials.js GET /
// Should have:
Credential.find({ userId: req.user.id })
           .select('-data.aadhaarNumber') // Hide full Aadhaar

// NOT:
Credential.find({}) // This is wrong!
```

### Fix
```javascript
// backend/routes/credentials.js
router.get('/', auth, async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.user.id })
      .select('_id type issuer data.fullName data.nationality validUntil isActive createdAt');

    res.json({ success: true, credentials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Issue: Browser Console Shows TypeErrors

### Common Error 1: Cannot read property 'map' of undefined
```
Error: TypeError: Cannot read property 'map' of undefined

Cause: credentials is undefined or not array

Fix:
1. In fetchCredentials(), set default:
   setCredentials(response.data.credentials || []);
2. In render, check:
   {credentials?.map(...)}
```

### Common Error 2: Cannot read property '_id' of null
```
Error: TypeError: Cannot read property '_id' of null

Cause: Trying to map over null instead of array

Fix:
1. Ensure credentials initialized as empty array: useState([])
2. Set after fetch: setCredentials(response.data.credentials || [])
3. Add optional chaining: credentials?.map(...)
```

### Common Error 3: selectedCredentialId is wrong type
```
Error: e.target.value returns string but comparing with object

Cause: credentialId stored as string, comparing with object

Fix: In dropdown onChange:
```javascript
onChange={(e) => {
  setSelectedCredentialId(e.target.value); // string
  console.log(typeof e.target.value); // 'string'
}}
```

---

## Quick Diagnostic Checklist

### Before Reporting Issues, Check:

- [ ] Backend running (`npm start` in backend folder)
- [ ] Frontend running (`npm run dev` in frontend folder)
- [ ] Logged in as valid user (has JWT token)
- [ ] Created at least one credential with ALL fields
- [ ] Credential appears in vault grid
- [ ] Verifier created request and got request code
- [ ] Request not expired (created < 5 minutes ago)
- [ ] Browser console has no JavaScript errors
- [ ] Network tab shows 200 responses for API calls
- [ ] Credential dropdown shows created credential

### If Still Have Issues:

1. **Check Backend Logs**
   ```bash
   # Look for error messages
   # Check if endpoint was called
   ```

2. **Check MongoDB**
   ```bash
   # Verify credentials exist
   # Verify user associations
   ```

3. **Check Frontend Console**
   ```javascript
   // Check what data was fetched
   // Check state variables
   ```

4. **Clear Cache & Retry**
   ```bash
   # Delete node_modules and reinstall
   rm -r node_modules package-lock.json
   npm install
   npm start
   ```

---

## Getting Help

### Information to Provide

1. **Exact Error Message** (from console or response)
2. **Steps to Reproduce** (1, 2, 3...)
3. **Screenshots** (show dropdown, error message, etc.)
4. **Backend Logs** (paste any relevant logs)
5. **Database State** (show credentials created)
6. **Network Response** (show what API returned)

### Example Issue Report Format
```
ISSUE: Credential dropdown not showing options
SYMPTOMS: Empty dropdown appears, no credentials listed
REPRODUCED BY:
1. Created credential with fullName, DOB, nationality
2. Went to approve request
3. Opened dropdown
4. No options shown

ERROR: None in console
NETWORK: GET /api/credentials returns 200
RESPONSE: {success: true, credentials: []}

Therefore: Data is empty from backend
```
