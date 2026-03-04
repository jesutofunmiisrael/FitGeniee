import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .required("OTP is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);
    setValue("otp", updated.join(""));

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const updated = pasted.split("");
      setOtpValues(updated);
      setValue("otp", pasted);
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    const { email, otp, newPassword } = data;
    try {
      const response = await fetch(
        `https://fitgenie-uy93.onrender.com/api/auth/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const result = await response.json();
      console.log("Server returned:", result);

      if (result.message) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Try again.");
      navigate("/login");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .rp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0f14;
          font-family: 'Sora', sans-serif;
          padding: 20px;
        }

        .rp-card {
          width: 100%;
          max-width: 420px;
          background: #141a22;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 44px 36px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rp-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1e6fff 0%, #1ad0a5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .rp-icon-wrap svg {
          width: 26px;
          height: 26px;
          fill: white;
        }

        .rp-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .rp-subtitle {
          font-size: 0.875rem;
          color: #6b7a8f;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .rp-subtitle span {
          color: #1e9fff;
        }

        /* Field */
        .rp-field {
          margin-bottom: 20px;
        }

        .rp-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #8a99ad;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }

        .rp-input-wrap {
          position: relative;
        }

        .rp-input {
          width: 100%;
          padding: 13px 16px;
          background: #0f151d;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .rp-input:focus {
          border-color: #1e6fff;
          box-shadow: 0 0 0 3px rgba(30, 111, 255, 0.15);
        }

        .rp-input::placeholder {
          color: #3d4f63;
        }

        .rp-input.has-icon {
          padding-right: 44px;
        }

        .rp-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #4a6080;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
          width: auto;
        }

        .rp-toggle:hover {
          color: #1e9fff;
          background: none;
        }

        .rp-error {
          margin-top: 6px;
          font-size: 0.78rem;
          color: #ff5c72;
        }

        /* OTP boxes */
        .otp-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }

        .otp-box {
          width: 100%;
          aspect-ratio: 1;
          background: #0f151d;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #1e6fff;
        }

        .otp-box:focus {
          border-color: #1e6fff;
          box-shadow: 0 0 0 3px rgba(30, 111, 255, 0.15);
        }

        .otp-box.filled {
          border-color: rgba(30, 208, 165, 0.4);
          background: rgba(30, 208, 165, 0.06);
        }

        /* Submit button */
        .rp-btn {
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          background: linear-gradient(135deg, #1e6fff 0%, #1ad0a5 100%);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }

        .rp-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .rp-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .rp-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rp-back {
          text-align: center;
          margin-top: 20px;
          font-size: 0.85rem;
          color: #4a6080;
        }

        .rp-back button {
          background: none;
          border: none;
          color: #1e9fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          width: auto;
          transition: color 0.2s;
        }

        .rp-back button:hover {
          color: #fff;
          background: none;
        }

        /* Divider */
        .rp-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 24px 0;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .rp-card {
            padding: 32px 22px;
            border-radius: 16px;
          }

          .rp-title {
            font-size: 1.35rem;
          }

          .otp-grid {
            gap: 6px;
          }

          .otp-box {
            font-size: 1rem;
            border-radius: 8px;
          }

          .rp-input {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 360px) {
          .rp-card {
            padding: 24px 16px;
          }

          .otp-grid {
            gap: 4px;
          }
        }

        @media (min-width: 768px) {
          .rp-page {
            padding: 40px 20px;
          }
        }
      `}</style>

      <div className="rp-page">
        <div className="rp-card">
       
          <div className="rp-icon-wrap">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z"/>
            </svg>
          </div>

          <h2 className="rp-title">Reset password</h2>
          <p className="rp-subtitle">
            We sent a 6-digit code to{" "}
            <span>your email</span>. Enter it below along with your new password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="rp-field">
              <label className="rp-label">Email</label>
              <div className="rp-input-wrap">
                <input
                  type="email"
                  className="rp-input"
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="rp-error">{errors.email.message}</p>}
            </div>

            <div className="rp-divider" />

            {/* OTP */}
            <div className="rp-field">
              <label className="rp-label">Verification Code</label>
              {/* hidden input to satisfy react-hook-form */}
              <input type="hidden" {...register("otp")} />
              <div className="otp-grid" onPaste={handleOtpPaste}>
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    className={`otp-box${val ? " filled" : ""}`}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              {errors.otp && <p className="rp-error">{errors.otp.message}</p>}
            </div>

            <div className="rp-divider" />

            {/* New Password */}
            <div className="rp-field">
              <label className="rp-label">New Password</label>
              <div className="rp-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="rp-input has-icon"
                  placeholder="Min. 8 characters"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="rp-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye-off */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    /* Eye */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="rp-error">{errors.newPassword.message}</p>
              )}
            </div>

            <button type="submit" className="rp-btn" disabled={isSubmitting}>
              {isSubmitting ? "Resetting…" : "Reset Password"}
            </button>
          </form>

          <div className="rp-back">
            Back to{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;