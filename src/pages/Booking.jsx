import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Booking = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (!user) return null;

  return (
    <div className="auth-container">
      <h2>Welcome to the Booking Dashboard</h2>
      <p>
        You are successfully logged in as: <strong>{user.email}</strong>
      </p>

      <div style={{ marginTop: "20px" }}>
        <p>Here you can view and manage your restaurant reservations.</p>
        <ul>
          <li>🍽 Table for 2 at Italian Bistro — June 18, 7:00 PM</li>
          <li>🍣 Sushi World — June 22, 6:30 PM</li>
        </ul>
      </div>

      <button style={{ marginTop: "20px" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Booking;
