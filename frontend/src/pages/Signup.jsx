import '../styles/signup.css'

import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("user"); // user | business
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    password: ""
  });

  const [businessData, setBusinessData] = useState({
    organizationName: "",
    businessEmail: "",
    industryType: "",
    adminName: "",
    password: "",
    gstId: ""
  });

  // redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) {
      navigate(user.role === "user" ? "/wallet" : "/business", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload;

      if (mode === "user") {
        payload = {
          name: userData.name,
          phone: userData.phone,
          password: userData.password,
          role: "user"
        };
      } else {
        if (!acknowledged) {
          setError("Please acknowledge the trust disclosure.");
          setLoading(false);
          return;
        }

        payload = {
          name: businessData.organizationName,
          email: businessData.businessEmail,
          password: businessData.password,
          role: "business",
          businessInfo: {
            industryType: businessData.industryType,
            adminName: businessData.adminName,
            gstId: businessData.gstId
          }
        };
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(mode === "user" ? "/wallet" : "/business");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-card">

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={mode === "user" ? "active" : ""}
            onClick={() => setMode("user")}
          >
            User Signup
          </button>
          <button
            className={mode === "business" ? "active" : ""}
            onClick={() => setMode("business")}
          >
            Verifier Signup
          </button>
        </div>

        <h2>
          {mode === "user"
            ? "Create Your Wallet"
            : "Register Organization as Verifier"}
        </h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* USER FORM */}
          {mode === "user" && (
            <>
              <input
                placeholder="Full Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                required
              />

              <input
                placeholder="Phone Number"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />
            </>
          )}

          {/* BUSINESS FORM */}
          {mode === "business" && (
            <>
              <input
                placeholder="Organization Name"
                value={businessData.organizationName}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    organizationName: e.target.value
                  })
                }
                required
              />

              <input
                type="email"
                placeholder="Business Email"
                value={businessData.businessEmail}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    businessEmail: e.target.value
                  })
                }
                required
              />

              <select
                value={businessData.industryType}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    industryType: e.target.value
                  })
                }
                required
              >
                <option value="">Select Industry</option>
                <option value="hotel">Hotel</option>
                <option value="bank">Bank</option>
                <option value="platform">Platform</option>
                <option value="government">Government</option>
              </select>

              <input
                placeholder="Admin Name"
                value={businessData.adminName}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    adminName: e.target.value
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={businessData.password}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    password: e.target.value
                  })
                }
                required
              />

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                />
                I acknowledge trust disclosure
              </label>
            </>
          )}

          <button disabled={loading}>
            {loading
              ? "Processing..."
              : mode === "user"
              ? "Create Wallet"
              : "Register Verifier"}
          </button>
        </form>
      </div>
    </div>
  );
}
