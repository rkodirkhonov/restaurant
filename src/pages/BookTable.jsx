import React, { useState, useEffect } from "react";
import "../pages/Auth.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const BookTable = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    datetime: "",
    request: "",
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchBookings(currentUser.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchBookings = async (uid) => {
    const q = query(
      collection(db, "bookings"),
      where("uid", "==", uid),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setBookings(data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.datetime) return;

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
    await fetchBookings(user.uid);
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  if (!user) return null;

  return (
    <div className="auth-container">
      <h2>Book a Table</h2>
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          required
        />
        <textarea
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
        <ul>
          {bookings.map((b, index) => (
            <li key={index}>
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
