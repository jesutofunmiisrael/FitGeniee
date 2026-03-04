// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "sonner";
// import "./signup.css";

// function Signup() {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

  
//   const schema = yup.object().shape({
//     fullName: yup.string().required("Full name is required"),
//     email: yup.string().email("Invalid email").required("Email is required"),
//     password: yup
//       .string()
//       .min(6, "Password must be 6+ characters")
//       .required("Password is required"),
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });


//   const handleSignUp = async (data) => {
//     setIsLoading(true);

//     try {
//       const res = await fetch("http://localhost:4000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();

//       if (!result.success) {
//      throw new Error(result.message || "failed to sign up")
     
//       }

//         if (result.token) {
//       localStorage.setItem("token", result.token);
//     }

//       if(res.status === 201){
//         toast.success("SIGNUP SUCCESSFULLY!  ✅ ");
//         navigate('/body');
      
//       } else {
//         toast.error(result.message || "Signup failed.");
//       }
//     } catch (error) {
//       toast.error("Error during signup.");
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//       reset();
//     }
//   };

//   return (
//     <div className="signup-container">


//       <div className="signup-header">
//         <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
//         <h2 className="signup-logo" onClick={() => navigate("/")}>FitAI</h2>
//         <div style={{ width: "50px" }}></div>
//       </div>


//       <div className="signup-box">

//         <h1 className="title">Create Your Account</h1>
//         <p className="subtitle">Join FitGenie to personalize your fitness journey.</p>

//         <form className="signup-form" onSubmit={handleSubmit(handleSignUp)}>

  
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               {...register("fullName")}
//               className={errors.fullName ? "input error" : "input"}
//             />
//             {errors.fullName && (
//               <p className="error-text">{errors.fullName.message}</p>
//             )}
//           </div>

 
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               {...register("email")}
//               className={errors.email ? "input error" : "input"}
//             />
//             {errors.email && (
//               <p className="error-text">{errors.email.message}</p>
//             )}
//           </div>

//      <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               {...register("password")}
//               className={errors.password ? "input error" : "input"}
//             />
//             {errors.password && (
//               <p className="error-text">{errors.password.message}</p>
//             )}
//           </div>


//           <button type="submit" disabled={isLoading} className="submit-btn">
//             {isLoading ? "Signing up..." : "Sign Up"}
//           </button>

//         </form>

//         <p className="login-hint">
//           Already have an account?
//           <Link to="/login" className="login-link">Login</Link>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Signup;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import "./signup.css";

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <- new state
  const navigate = useNavigate();

  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be 6+ characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleSignUp = async (data) => {
    setIsLoading(true);

    try {
      const res = await fetch("https://fitgenie-uy93.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to sign up");
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (res.status === 201) {
        toast.success("SIGNUP SUCCESSFULLY! ✅");
        navigate("/body");
      } else {
        toast.error(result.message || "Signup failed.");
      }
    } catch (error) {
      toast.error("Error during signup.");
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
        <h1 className="title">Create Your Account</h1>
        <p className="subtitle">Join FitGenie to personalize your fitness journey.</p>

        <form className="signup-form" onSubmit={handleSubmit(handleSignUp)}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              {...register("fullName")}
              className={errors.fullName ? "input error" : "input"}
            />
            {errors.fullName && (
              <p className="error-text">{errors.fullName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              {...register("email")}
              className={errors.email ? "input error" : "input"}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
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
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="login-hint">
          Already have an account?
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
