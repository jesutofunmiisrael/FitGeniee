import React, { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import "./forget.css";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) return toast.error("Email is required");

    setIsLoading(true);

    try {
      const res = await fetch("https://fitgenie-uy93.onrender.com/api/auth/forget", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Verification code sent!");
          navigate("/rest");

      } else {
        toast.error(result.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forget-container">

      <div className="forget-box">
        
        <div className="icon-box">
          <span>📩</span>
        </div>

        <h1 className="forget-title">Forgot password?</h1>

        <p className="forget-sub">
          No worries. Enter your email address and we’ll send you a verification code to reset your password.
        </p>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-box">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <button
          className="submit-btn"
          disabled={!email || isLoading}      
          onClick={handleSendCode}
        >
          {isLoading ? "Sending..." : "Send Verification Code →"}
        </button>

        <p className="back-text">
          Remember your password?
          <Link className="link" to="/login"> Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;
