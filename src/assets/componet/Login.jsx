import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import "./login.css";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <- new state
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleLogin = async (data) => {
    setIsLoading(true);

    try {
      const res = await fetch("https://fitgenie-uy93.onrender.com/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (result.success) {
        toast.success("Login successful!");
        navigate("/body");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Error during login.");
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2 className="signup-logo" onClick={() => navigate("/")}>
     FitGenie
        </h2>
        <div style={{ width: "50px" }}></div>
      </div>

      <div className="signup-box">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Login to continue your fitness journey.</p>

        <form className="signup-form" onSubmit={handleSubmit(handleLogin)}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              {...register("email")}
              className={errors.email ? "input error" : "input"}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} // <- dynamic type
                {...register("password")}
                className={errors.password ? "input error" : "input"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}

            <p className="forgot-password">
              <Link to="/forget">Forgot Password?</Link>
            </p>
          </div>

          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-hint">
          Don’t have an account?
          <Link to="/signup" className="login-link">
            {" "}
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
