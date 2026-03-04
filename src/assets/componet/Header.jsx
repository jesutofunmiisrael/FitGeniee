import React from "react";
import "./header.css";
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="logo">FitGenie</div>

      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#testimonials">Testimonials</a>
  
      </nav>

      <div className="right-side">
      <Link to="/login">  <button className="login-btn">Login</button></Link>
<Link to="/signup">   <button className="signup-btn">Sign Up</button></Link>
      </div>
    </header>
  );
}

