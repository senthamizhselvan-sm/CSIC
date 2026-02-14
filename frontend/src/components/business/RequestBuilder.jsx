import { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../../styles/business/RequestBuilder.css';

export default function RequestBuilder({ token, onClose, organizationName }) {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    age18: false,
    age21: false,
    nationality: false,
    name: false,
    residency: false
  });
  const [requestExpiry, setRequestExpiry] = useState('5');
  const [proofValidity, setProofValidity] = useState('5');
  const [privacyMode, setPrivacyMode] = useState('zero-knowledge');
  const [createdRequest, setCreatedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const purposes = [
    { id: 'hotel-checkin', icon: 'building', label: 'Hotel Check-In', desc: 'Guest verification' },
    { id: 'account-opening', icon: 'bank', label: 'Account Opening', desc: 'Bank/KYC compliance' },
    { id: 'age-gate', icon: 'cup-straw', label: 'Age Verification', desc: '18+/21+ verification' },
    { id: 'employment', icon: 'briefcase-fill', label: 'Employment', desc: 'Job verification' },
    { id: 'health', icon: 'hospital-fill', label: 'Health Service', desc: 'Medical registration' }
  ];

  const attributes = [
    { id: 'age18', label: 'Age Verification (18+)', field: 'age', type: 'verification_only', risk: 'LOW' },
    { id: 'age21', label: 'Age Verification (21+)', field: 'age21', type: 'verification_only', risk: 'LOW' },
    { id: 'nationality', label: 'Nationality', field: 'nationality', type: 'selective_disclosure', risk: 'LOW' },
    { id: 'name', label: 'Name Verification', field: 'name', type: 'verification_only', risk: 'MEDIUM' },
    { id: 'residency', label: 'Residency Status', field: 'residency', type: 'selective_disclosure', risk: 'MEDIUM' }
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!purpose && !customPurpose) {
      newErrors.purpose = 'Please select a purpose or enter a custom purpose';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (getSelectedCount() === 0) {
      newErrors.attributes = 'Please select at least one attribute to verify';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (parseInt(requestExpiry) <= 0) {
      newErrors.requestExpiry = 'Request expiry must be greater than 0';
    }
    if (parseInt(proofValidity) <= 0) {
      newErrors.proofValidity = 'Proof validity must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRequest = async () => {
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const requestedData = attributes
        .filter(attr => selectedAttributes[attr.id])
        .map(attr => ({ field: attr.field, type: attr.type }));

      const res = await axios.post(
        'http://localhost:5000/api/verification/request',
        {
          businessName: organizationName,
          purpose: purpose || customPurpose,
          requestedData,
          expiryMinutes: parseInt(requestExpiry),
          privacyMode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCreatedRequest(res.data);
      setStep(4); // Show QR code
    } catch (error) {
      console.error('Failed to create request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create verification request. Please try again.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = (currentStep) => {
    setErrors({});
    setApiError('');
    
    if (currentStep === 1 && validateStep1()) {
      setStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedAttributes).filter(v => v).length;
  };

  const getRiskLevel = () => {
    const selected = attributes.filter(attr => selectedAttributes[attr.id]);
    if (selected.some(a => a.risk === 'MEDIUM')) return { level: 'MEDIUM', color: '#f59e0b' };
    return { level: 'LOW', color: '#10b981' };
  };

  return (
    <div className="bp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bp-modal">
        <div className="bp-modal-header">
          <h2>Create Verification Request</h2>
          <button className="bp-modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>

        <div className="bp-modal-body">
          {/* STEP INDICATOR */}
          <div className="bp-steps">
            <div className={`bp-step ${step >= 1 ? 'active' : ''}`}>
              <div className="bp-step-number">1</div>
              <div className="bp-step-label">Purpose</div>
            </div>
            <div className={`bp-step ${step >= 2 ? 'active' : ''}`}>
              <div className="bp-step-number">2</div>
              <div className="bp-step-label">Attributes</div>
            </div>
            <div className={`bp-step ${step >= 3 ? 'active' : ''}`}>
              <div className="bp-step-number">3</div>
              <div className="bp-step-label">Configure</div>
            </div>
          </div>

          {/* STEP 1: SELECT PURPOSE */}
          {step === 1 && (
            <div className="bp-step-content">
              <h3>Select Verification Purpose</h3>
              
              {errors.purpose && (
                <div className="bp-error-box">
                  <i className="bi bi-exclamation-circle-fill"></i> {errors.purpose}
                </div>
              )}
              
              <div className="bp-purpose-grid-large">
                {purposes.map(p => (
                  <button
                    key={p.id}
                    className={`bp-purpose-card-large ${purpose === p.id ? 'selected' : ''}`}
                    onClick={() => {
                      setPurpose(p.id);
                      setCustomPurpose('');
                      setErrors({});
                    }}
                  >
                    <div className="bp-purpose-icon-large"><i className={`bi bi-${p.icon}`}></i></div>
                    <div className="bp-purpose-label-large">{p.label}</div>
                    <div className="bp-purpose-desc">{p.desc}</div>
                  </button>
                ))}
              </div>

              <div className="bp-form-group">
                <label>Custom Purpose</label>
                <input
                  type="text"
                  className="bp-input"
                  placeholder="Enter custom purpose..."
                  value={customPurpose}
                  onChange={(e) => {
                    setCustomPurpose(e.target.value);
                    setPurpose('');
                    setErrors({});
                  }}
                />
              </div>

              <div className="bp-modal-actions">
                <button className="bp-btn bp-btn-secondary" onClick={onClose}>Cancel</button>
                <button 
                  className="bp-btn bp-btn-primary" 
                  onClick={() => handleNextStep(1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ATTRIBUTES */}
          {step === 2 && (
            <div className="bp-step-content">
              <h3>Select Attributes to Verify</h3>
              
              <div className="bp-warning-box">
                <i className="bi bi-exclamation-triangle-fill"></i> You can only request verified attributes, not documents
              </div>

              {errors.attributes && (
                <div className="bp-error-box">
                  <i className="bi bi-exclamation-circle-fill"></i> {errors.attributes}
                </div>
              )}

              <div className="bp-attributes-grid">
                <div className="bp-attributes-section">
                  <h4>Identity Attributes</h4>
                  {attributes.map(attr => (
                    <label key={attr.id} className="bp-checkbox-card">
                      <input
                        type="checkbox"
                        checked={selectedAttributes[attr.id]}
                        onChange={(e) => {
                          setSelectedAttributes({
                            ...selectedAttributes,
                            [attr.id]: e.target.checked
                          });
                          setErrors({});
                        }}
                      />
                      <div className="bp-checkbox-content">
                        <div className="bp-checkbox-label">{attr.label}</div>
                        <div className="bp-checkbox-meta">
                          Risk: <span style={{color: attr.risk === 'LOW' ? '#10b981' : '#f59e0b'}}>{attr.risk}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bp-privacy-impact">
                  <h4>Privacy Impact</h4>
                  <div className="bp-impact-box">
                    <div className="bp-impact-item">
                      <strong>Risk Level:</strong> 
                      <span style={{color: getRiskLevel().color, marginLeft: '8px'}}>
                        {getRiskLevel().level}
                      </span>
                    </div>
                    <div className="bp-impact-item">
                      <strong>Attributes Selected:</strong> {getSelectedCount()}
                    </div>
                    <div className="bp-impact-item">
                      <strong>Approval Rate:</strong> ~94%
                    </div>
                  </div>

                  <div className="bp-restricted-box">
                    <h5><i className="bi bi-slash-circle"></i> Restricted Attributes</h5>
                    <ul>
                      <li><i className="bi bi-x-circle-fill"></i> ID Numbers</li>
                      <li><i className="bi bi-x-circle-fill"></i> Exact Birthdates</li>
                      <li><i className="bi bi-x-circle-fill"></i> Photos</li>
                      <li><i className="bi bi-x-circle-fill"></i> Full Addresses</li>
                      <li><i className="bi bi-x-circle-fill"></i> Document Copies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bp-modal-actions">
                <button className="bp-btn bp-btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button 
                  className="bp-btn bp-btn-primary" 
                  onClick={() => handleNextStep(2)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIGURE & PREVIEW */}
          {step === 3 && (
            <div className="bp-step-content">
              <h3>Configure Duration & Privacy</h3>

              {apiError && (
                <div className="bp-error-box">
                  <i className="bi bi-exclamation-circle-fill"></i> {apiError}
                </div>
              )}

              <div className="bp-form-group">
                <label>Request Expires In</label>
                <select 
                  className="bp-select" 
                  value={requestExpiry}
                  onChange={(e) => {
                    setRequestExpiry(e.target.value);
                    setErrors({});
                  }}
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
                {errors.requestExpiry && (
                  <div className="bp-error-text">
                    <i className="bi bi-exclamation-circle-fill"></i> {errors.requestExpiry}
                  </div>
                )}
              </div>

              <div className="bp-form-group">
                <label>Proof Valid For</label>
                <select 
                  className="bp-select"
                  value={proofValidity}
                  onChange={(e) => {
                    setProofValidity(e.target.value);
                    setErrors({});
                  }}
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">24 hours</option>
                </select>
                {errors.proofValidity && (
                  <div className="bp-error-text">
                    <i className="bi bi-exclamation-circle-fill"></i> {errors.proofValidity}
                  </div>
                )}
              </div>

              <div className="bp-form-group">
                <label>Privacy Mode</label>
                <label className="bp-radio-card">
                  <input
                    type="radio"
                    name="privacy"
                    value="zero-knowledge"
                    checked={privacyMode === 'zero-knowledge'}
                    onChange={(e) => setPrivacyMode(e.target.value)}
                  />
                  <div className="bp-radio-content">
                    <strong>Zero-Knowledge (Recommended)</strong>
                    <div className="bp-radio-desc">Shows only YES/NO answers • Higher approval rate</div>
                  </div>
                </label>
                <label className="bp-radio-card">
                  <input
                    type="radio"
                    name="privacy"
                    value="selective-disclosure"
                    checked={privacyMode === 'selective-disclosure'}
                    onChange={(e) => setPrivacyMode(e.target.value)}
                  />
                  <div className="bp-radio-content">
                    <strong>Selective Disclosure</strong>
                    <div className="bp-radio-desc">Shows specific values • Lower approval rate</div>
                  </div>
                </label>
              </div>

              {/* PREVIEW */}
              <div className="bp-preview-box">
                <h4>Request Summary</h4>
                <div className="bp-preview-item">
                  <strong>Purpose:</strong> {purpose || customPurpose}
                </div>
                <div className="bp-preview-item">
                  <strong>Privacy:</strong> {privacyMode}
                </div>
                <div className="bp-preview-item">
                  <strong>Expires:</strong> {requestExpiry} minutes
                </div>
                <div className="bp-preview-item">
                  <strong>User will see:</strong> "{organizationName} wants to verify: {
                    attributes.filter(a => selectedAttributes[a.id]).map(a => a.label).join(', ')
                  }"
                </div>
                <div className="bp-preview-compliance">
                  Compliance Impact: <span style={{color: '#10b981'}}><i className="bi bi-circle-fill text-success"></i> LOW</span> (No PII storage required)
                </div>
              </div>

              <div className="bp-modal-actions">
                <button className="bp-btn bp-btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button 
                  className="bp-btn bp-btn-primary" 
                  onClick={handleCreateRequest}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="bp-spinner-small"></span> Creating...
                    </>
                  ) : (
                    'Create Verification Request'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SHOW QR CODE */}
          {step === 4 && createdRequest && (
            <div className="bp-step-content bp-center">
              <h3><i className="bi bi-check-circle-fill text-success"></i> Verification Request Created</h3>
              <p>Customer can scan this QR code or enter the code below</p>

              <div className="bp-qr-display">
                <QRCodeCanvas value={createdRequest.requestId} size={240} />
              </div>

              <div className="bp-request-code">{createdRequest.requestId}</div>

              <div className="bp-share-options">
                <button className="bp-btn bp-btn-secondary"><i className="bi bi-clipboard-check"></i> Copy Code</button>
                <button className="bp-btn bp-btn-secondary"><i className="bi bi-phone-fill"></i> Send SMS</button>
                <button className="bp-btn bp-btn-secondary"><i className="bi bi-envelope-fill"></i> Send Email</button>
              </div>

              <div className="bp-status-indicator">
                <div className="bp-spinner"></div>
                <span>Waiting for customer approval...</span>
              </div>

              <div className="bp-modal-actions">
                <button className="bp-btn bp-btn-primary" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
