import React, { useState, useEffect } from "react";
import "../pages/Auth.css";
import { useNavigate } from "react-router-dom";
import { validateReservation } from "../utils/validateReservation";
import useBookings from "../hooks/useBookings";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
} from "firebase/firestore";

const BookTable = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    datetime: "",
    request: "",
  });
  const { bookings, status, reload } = useBookings(user?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateReservation(formData);
    setErrors(validation);
    const firstInvalid = Object.keys(validation)[0];
    if (firstInvalid) {
      e.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }

    const newBooking = {
      ...formData,
      uid: user.uid,
      createdAt: new Date(),
    };

    await addDoc(collection(db, "bookings"), newBooking);
    setFormData({
      name: "",
      email: "",
      datetime: "",
      request: "",
    });
    await reload();
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  if (!user) return null;

  return (
    <div className="auth-container">
      <h2>Book a Table</h2>
      <form className="app__book-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="booking-name">Full name</label>
        {errors.name && <span id="name-error" role="alert">{errors.name}</span>}
        <input
          id="booking-name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="booking-email">Email address</label>
        {errors.email && <span id="email-error" role="alert">{errors.email}</span>}
        <input
          id="booking-email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="booking-datetime">Date and time</label>
        {errors.datetime && <span id="datetime-error" role="alert">{errors.datetime}</span>}
        <input
          id="booking-datetime"
          aria-invalid={Boolean(errors.datetime)}
          aria-describedby={errors.datetime ? "datetime-error" : undefined}
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          required
        />
        <label htmlFor="booking-request">Special requests (optional)</label>
        <textarea
          id="booking-request"
          name="request"
          placeholder="Any special request?"
          rows="4"
          value={formData.request}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Book Now</button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h3>Your Bookings</h3>
        {status === "loading" && <p role="status">Loading your bookings…</p>}
        {status === "error" && <div role="alert">
          <p>We could not load your bookings. Please try again.</p>
          <button type="button" onClick={reload}>Retry</button>
        </div>}
        {status === "success" && bookings.length === 0 && <p>You have no bookings yet.</p>}
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              🍽 {b.name} - {b.datetime} <br />
              <small>{b.email}</small> <br />
              {b.request && <em>“{b.request}”</em>}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default BookTable;
