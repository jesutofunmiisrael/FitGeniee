import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./bodystats.css";

function BodyStats() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    timePerDay: "",
    dietPreferance: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleContinue = async () => {
  const { age, gender, height, weight, goal, timePerDay, dietPreferance } = formData;

  if (!age) return toast.error("Age is required");
  if (!gender) return toast.error("Gender is required");
  if (!height) return toast.error("Height is required");
  if (!weight) return toast.error("Weight is required");
  if (!goal) return toast.error("Goal is required");
  if (!timePerDay) return toast.error("Time per day is required");
  if (!dietPreferance) return toast.error("Diet preference is required");

  try {
    setIsLoading(true);

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      toast.error("You are not logged in. Please login again.");
      setIsLoading(false);
      return;
    }

    
    const token = storedToken.replace(/"/g, "").trim();

    const res = await fetch("https://fitgenie-uy93.onrender.com/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Profile updated successfully!");
      navigate("/dash");
    } else {
      toast.error(result.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="body-container">

      <div className="signup-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="signup-logo" onClick={() => navigate("/")}>FitAI</h2>
        <div style={{ width: "50px" }}></div>
      </div>

      <div className="body-box">
        <h1 className="body-title">Your body stats</h1>
        <p className="body-sub">This helps our AI build the perfect plan for your body.</p>

  
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input"
          />
        </div>

     
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="input">
            <option value=""  style={{color:"black"}}>Select gender</option>
            <option value="male" style={{color:"black"}}>Male</option>
            <option value="female"  style={{color:"black"}}>Female</option>
            <option value="other"  style={{color:"black"}}>Other</option>
          </select>
        </div>

     
        <div className="row">
          <div className="form-group half">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group half">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="input">
            <option value=""  style={{color:"black"}}>Select goal</option>
            <option value="lose-weight"  style={{color:"black"}}>Lose Weight</option>
            <option value="build-muscle"  style={{color:"black"}}>Build Muscle</option>
            <option value="stay-fit"  style={{color:"black"}}>Stay Fit</option>
          </select>
        </div>

 
        <div className="form-group">
          <label>Time Per Day (minutes)</label>
          <input
            type="number"
            name="timePerDay"
            value={formData.timePerDay}
            onChange={handleChange}
            className="input"
          />
        </div>


        <div className="form-group">
          <label>Diet Preference</label>
          <select
            name="dietPreferance"
            value={formData.dietPreferance}
            onChange={handleChange}
            className="input"
          >
            <option value=""  style={{color:"black"}}>Select diet</option>
            <option value="balanced"  style={{color:"black"}}>Balanced</option>
            <option value="vegetarian"  style={{color:"black"}}>Vegetarian</option>
            <option value="keto"  style={{color:"black"}}>Keto</option>
            <option value="vegan"  style={{color:"black"}}>Vegan</option>
          </select>
        </div>


        <div className="button-row">
          <button className="back-small" onClick={() => navigate(-1)}>← Back</button>

          <button className="submit-btn" onClick={handleContinue} disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue →"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BodyStats;
