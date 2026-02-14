# VerifyOnce Backend Test Checklist

## 1. Authentication
- GET /api/auth/demo-user
  - Headers: none
  - Expected: 200 with token and user
- GET /api/auth/demo-business
  - Headers: none
  - Expected: 200 with token and user
- Invalid token
  - Headers: Authorization: Bearer invalid
  - Expected: 401
- Wrong role access
  - Use user token on business route (or vice versa)
  - Expected: 403

## 2. Verification Lifecycle (Happy Path)
- POST /api/verification/request
  - Headers: Authorization: Bearer <business token>
  - Body: { "businessName": "Grand Hotel Mumbai", "requestedData": [{ "field": "age", "type": "verification_only" }] }
  - Expected: 200 with requestId, expiresAt, qrData
- GET /api/verification/request/:requestId
  - Headers: Authorization: Bearer <user token>
  - Expected: 200 with businessName, requestedData, expiresAt
- POST /api/verification/approve/:requestId
  - Headers: Authorization: Bearer <user token>
  - Expected: 200 with proofId, proofExpiresAt, sharedData
- GET /api/verification/status/:requestId
  - Headers: Authorization: Bearer <business token>
  - Expected: 200 with status approved and sharedData
- Wait 5 minutes
- GET /api/verification/status/:requestId
  - Expected: status expired

## 3. Verification Lifecycle (User Rejection)
- POST /api/verification/request
- GET /api/verification/request/:requestId
- POST /api/verification/deny/:requestId
  - Expected: 200 with success true
- GET /api/verification/status/:requestId
  - Expected: status denied

## 4. Verification Lifecycle (Request Expiry)
- POST /api/verification/request with validityMinutes: 1
- Wait 2 minutes
- GET /api/verification/request/:requestId
  - Expected: 400 "Request expired"
- GET /api/verification/status/:requestId
  - Expected: status expired

## 5. Verification Lifecycle (User Revocation)
- POST /api/verification/request
- POST /api/verification/approve/:requestId
- POST /api/verification/revoke/:requestId
  - Expected: 200 with success true
- GET /api/verification/status/:requestId
  - Expected: status revoked

## 6. Wallet Management
- GET /api/wallet/credentials
  - Expected: credentials list (masked)
- POST /api/wallet/add-credential
  - Expected: success true, credential returned (masked)
- GET /api/wallet/credential/:credentialId
  - Expected: masked idNumber and dateOfBirth

## 7. Business Analytics
- GET /api/business/stats
  - Expected: today metrics
- GET /api/business/recent
  - Expected: last 10 verifications
- GET /api/business/active
  - Expected: active proofs only
- GET /api/business/analytics
  - Expected: 30-day analytics

## 8. Edge Cases
- User without credential tries to approve
  - Expected: 404
- Business tries to approve own request
  - Expected: 403
- Invalid requestId
  - Expected: 404
- Expired request cannot be approved
  - Expected: 400

Notes:
- Use Postman, curl, or VS Code REST Client.
- Include Authorization: Bearer <token> headers for protected routes.
