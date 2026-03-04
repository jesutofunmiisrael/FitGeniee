import React from "react";
import "./home.css";
import { Link, useNavigate } from 'react-router-dom'
function Home() {
  return (
    <div className="home">


      <section className="hero">
        <h1 className="hero-title">
          Transform Your <br />
          <span className="gradient-text">Body From Home</span>
        </h1>

        <p className="hero-subtext">
          Personalized workout plans powered by AI that adapt to your progress.
          Track nutrition, analyze performance, and achieve results faster than
          ever before.
        </p>

        <div className="hero-buttons">
       <Link to = "/login">   <button className="btn-primary">Get Started →</button></Link>
      
        </div>
      </section>

 
      <section className="stats">
        <p className="stats-subtitle">
          Join 10,000+ members already transforming
        </p>

        <div className="stats-box">
          <div className="stat">
            <h2>10K+</h2>
            <p>Active Members</p>
          </div>

          <div className="stat">
            <h2>500+</h2>
            <p>Workouts</p>
          </div>

          <div className="stat">
            <h2>98%</h2>
            <p>Success Rate</p>
          </div>
        </div>
      </section>


      <section className="features">
        <h2 className="section-title">Everything You Need to Succeed</h2>

        <p className="section-subtext">
          Our comprehensive platform combines cutting‑edge AI with proven fitness
          science to deliver the most effective workout experience.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="icon blue"></div>
            <h3>Workout Plans</h3>
            <p>Custom plans built for your goals and fitness level, adapting as you get stronger.</p>
          </div>

          <div className="feature-card">
            <div className="icon purple"></div>
            <h3>AI Tracking</h3>
            <p>Smart AI monitors your progress and adjusts workouts in real-time.</p>
          </div>

          <div className="feature-card">
            <div className="icon pink"></div>
            <h3>Nutrition Guide</h3>
            <p>Personalized meal plans and macro tracking for optimal results.</p>
          </div>

          <div className="feature-card">
            <div className="icon orange"></div>
            <h3>Progress Analytics</h3>
            <p>Insights and visuals to keep you motivated and on track.</p>
          </div>

        </div>
      </section>

    
      <section className="testimonials">
        <h2 className="section-title">Real Results, Real People</h2>
        <p className="section-subtext">
          Join thousands of users who have transformed their lives with our
          AI‑powered platform.
        </p>

        <div className="testimonial-grid">

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="review">
              "Lost 30 lbs in 3 months! The AI tracking is incredible. It knew
              exactly when to push me harder and when to let me recover. Never
              felt more motivated."
            </p>
            <div className="reviewer">
              <div className="avatar blue">SM</div>
              <div>
                <h4 style={{color:"white"}}>Sarah Mitchell</h4>
                <span style={{color:"white"}}>Lost 30 lbs</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="review">
              "The personalized workout plans are exactly what I needed. My
              strength has doubled and I've finally broken through my plateau.
              Highly recommended!"
            </p>
            <div className="reviewer">
              <div className="avatar purple">MT</div>
              <div>
                <h4 style={{color:"white"}}>Marcus Thompson</h4>
                <span style={{color:"white"}}>Strength Training</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="review">
              "FitGenie changed my life. The nutrition guide made healthy eating
              simple and enjoyable, not a chore. I have more energy than I did
              in my 20s."
            </p>
            <div className="reviewer">
              <div className="avatar pink">JK</div>
              <div>
                <h4 style={{color:"white"}}>Jennifer Kim</h4>
                <span style={{color:"white"}}>Lifestyle Change</span>
              </div>
            </div>
          </div>

        </div>
      </section>

 
      <footer className="footer">

        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">FitGenie</h2>
            <p className="footer-text">
              The smartest way to get fit. AI‑powered workouts,
              nutrition tracking, and real‑time coaching to help you
              reach your goals.
            </p>

            <div className="socials">
              <span>📘</span>
              <span>🐦</span>
              <span>📸</span>
              <span>▶️</span>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">AI Tracking</a>
              <a href="#">Nutrition</a>
            </div>

            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>

            <div>
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 FitGenie Inc. All rights reserved.</p>
          <p>Made with ❤️ for fitness lovers</p>
        </div>
      </footer>




    </div>
  );
}

export default Home;
