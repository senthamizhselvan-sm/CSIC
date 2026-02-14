# Credential Selection & Validation Flow

## Overview
Enhanced the verification approval flow so users must select which credential to use for each verification request, and the backend validates that the selected credential has all the fields requested by the verifier.

## Updated User Journey

### Step 1: User Creates Credential
1. User logs in → goes to "Add Credential" section
2. Fills in identity details:
   - Credential Type (Aadhaar, Passport, etc.)
   - Full Name
   - Date of Birth
   - Nationality
   - Last 4 digits of Aadhaar
   - Address
3. Submits form → Backend creates credential in database
4. Credential appears in "Credential Vault" section

### Step 2: Verifier Creates Request
1. Verifier logs in → Verifier Dashboard
2. Creates verification request selecting data types:
   - Age (requires DOB)
   - Nationality (requires nationality field)
   - Identity (requires Aadhaar)
   - Address (requires address field)
3. Gets request code (VF-XXXXXX) with 5-minute expiry

### Step 3: User Views Request & Selects Credential (NEW)
1. User enters request code → sees request details:
   - Who is requesting (verifier name)
   - What data will be shared
   - What data WON'T be shared (privacy info)
   - Request expiry time
   - **NEW: Credential selection dropdown showing all user's active credentials**

2. User selects which credential to use for this request
3. System validates credential has all requested fields:
   - If ✅ Match → User can approve
   - If ❌ Mismatch → User sees error: "This credential doesn't have the requested data"

### Step 4: User Approves (With Validation)
1. User clicks "Approve Request"
2. Backend performs validation:
   ```
   ✓ Request is still pending
   ✓ Request has not expired (< 5 min)
   ✓ Credential is active and not expired
   ✓ Credential has all fields in requestedData array:
     - If 'age' requested → credential must have dateOfBirth
     - If 'nationality' requested → credential must have nationality
     - If 'fullName' requested → credential must have fullName
     - If 'address' requested → credential must have address
     - If 'identity' requested → credential must have aadhaarNumber
   ```

3. If all validations pass:
   - Backend generates Proof with ONLY requested fields
   - Never shares unrequested data (e.g., if age is requested, DOB not shared)
   - Proof expires in 3 minutes

4. If validation fails:
   - Returns error: "This credential is missing required fields: [list]"
   - User must select a different credential or cancel

## Frontend Changes

### New State
```javascript
const [selectedCredentialId, setSelectedCredentialId] = useState(null);
```

### Updated Components

**1. Request Details Modal - Credential Selection UI**
```
Shows dropdown with:
- All user's active credentials
- Credential type, issuer, and status
- Error message if no credentials available
- Confirmation message once selected
```

**2. Credential Vault Component**
```
Now displays:
- Grid of user's actual credentials (not placeholders)
- Each credential card shows:
  * Type and issuer
  * Full name, nationality
  * Active/Inactive status
  * Valid until date
  * View and Revoke buttons
- "Add New Credential" button (when no credentials)
```

### Updated Functions

**approve() function**
```javascript
- Now checks if selectedCredentialId is set
- Sends credentialId in POST body
- Handles validation errors from backend
```

**submitCredential() function**
```javascript
- After successful creation:
  * Resets credentialForm to empty
  * Resets selectedCredentialId
  * Fetches updated credentials list
  * Redirects to credentials tab
```

**fetchCredentials() function**
```javascript
- Updated to call /api/credentials endpoint
- Returns array of all user credentials with details
```

## Backend Changes

### New/Updated Endpoints

**1. GET /api/credentials** (NEW)
```
Returns: Array of user's credentials with:
- _id, type, issuer, fullName, nationality
- dateOfBirth presence flag
- address presence flag
- isActive status, verifiedAt, validUntil dates

Used to: Populate credential selection dropdown
```

**2. POST /api/verification/approve/:requestId** (UPDATED)
```
Now accepts: { credentialId: "..." }

Added validation:
- credentialId must be provided
- Credential must belong to user and be active
- Credential must have all fields in request.requestedData

Example validation:
- If requestedData = ['age', 'nationality']
- Credential must have dateOfBirth AND nationality
- Else: 400 error "missing required fields"
```

### Database Impact
- Uses existing Credential model
- No schema changes required
- Proof generation logic remains same (minimal data sharing)

## Field Mapping for Validation

| Request Field | Credential Field Required | Used For |
|---|---|---|
| age | dateOfBirth | Calculate age, return ageVerified boolean |
| nationality | nationality field | Return nationality string |
| fullName | fullName field | Return full name |
| address | address field | Return address string |
| identity | aadhaarNumber field | Verify ID exists (not shared) |

## Error Scenarios

### Missing Credential
```
User: "I don't have any credentials yet"
System: Shows error banner in request details
User: Clicks link to "Add Credential" section
```

### Selected Credential Missing Fields
```
Verifier asks: age, nationality
User selects: Credential with only fullName and address
System: Returns error "This credential is missing: date of birth, nationality"
User: Either adds those fields to credential OR cancels request
```

### Credential Expired
```
Credential validUntil < now
User: Sees error "Your credential has expired"
User: Must renew credential before approving any request
```

## Privacy Guarantees

✓ **Only Requested Data Shared**: Proof contains only fields in requestedData array
✓ **Full Control**: User selects credential for each request
✓ **No Permanent Sharing**: Proof expires in 3 minutes
✓ **User-Specified Selection**: User, not system, decides which credential to use
✓ **Validation Before Share**: Backend validates credential fits request before generating proof

## Testing Checklist

- [ ] User can create credential with all fields
- [ ] Credentials appear in vault with correct info
- [ ] Verifier creates request asking for age + nationality
- [ ] User enters request code and sees credential dropdown
- [ ] User selects credential
- [ ] Backend validates credential has all requested fields
- [ ] Approval succeeds when fields match
- [ ] Approval fails with clear error when fields missing
- [ ] Proof contains only requested fields (not DOB, address if not requested)
- [ ] Multiple credentials work - user can select different ones for different requests
- [ ] Expired credentials show as inactive in dropdown and cannot be selected
- [ ] Missing credentials error shows helpful "Add Credential" button

## Next Enhancements

1. **Credential-Specific Privacy Levels**: Mark credentials with different sensitivity levels
2. **Auto-Select**: Allow users to set a "default" credential for automatic approvals
3. **Conditional Sharing**: "Ask me for address only if age is 21+"
4. **Credential Renewal**: Automatic or manual renewal before expiry
5. **Multi-Credential Approval**: One request can span multiple credentials
