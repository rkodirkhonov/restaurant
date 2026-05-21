import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const emptyForm = { name: "", datetime: "", request: "" };

const BookTable = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [bookings, setBookings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (uid) => {
    const q = query(
      collection(db, "bookings"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, []);

  useEffect(() => {
    if (user) fetchBookings(user.uid);
  }, [user, fetchBookings]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.datetime) return;

    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, "bookings"), {
        ...formData,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
      setFormData(emptyForm);
      await fetchBookings(user.uid);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="auth-container">
      <h2>Book a Table</h2>
      <p>Signed in as <strong>{user.email}</strong></p>

      <form className="app__book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
          required
        />
        <textarea
          name="request"
          placeholder="Any special request?"
          rows="4"
          value={formData.request}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Booking..." : "Book Now"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h3>Your Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id}>
                {b.name} — {new Date(b.datetime).toLocaleString()}
                {b.request && (
                  <>
                    <br />
                    <em>"{b.request}"</em>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: "1.5rem" }}>
        Logout
      </button>
    </div>
  );
};

export default BookTable;
