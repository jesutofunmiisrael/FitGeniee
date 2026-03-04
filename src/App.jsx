import React from "react";
import Header from "./assets/componet/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./assets/componet/Home";
import Signup from "./assets/componet/Signup";
import Login from "./assets/componet/Login";
import { Toaster } from "sonner";
import BodyStats from "./Bodystats";
import ForgetPassword from "./Forget";
import ResetPassword from "./Reste";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
const AppContent = () => {
  const location = useLocation();

  const hideHeaderRoutes = ["/signup", "/login", "/body", "/forget", "/rest", "/dash"];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div>
      <Toaster richColors position="top-right" />


      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/body" element={<BodyStats />} />
            <Route path="/forget" element={<ForgetPassword />} />
                 <Route path="/rest" element={<ResetPassword />} />
                    <Route
  path="/dash"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
