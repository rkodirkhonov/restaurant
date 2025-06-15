import React from "react";
import "../pages/Auth.css"; // 👈 make sure this is imported

const BookTable = () => {
  return (
    <div className="auth-container">
      <h2>Book a Table</h2>
      <form className="app__book-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="datetime-local" required />
        <textarea placeholder="Any special request?" rows="4"></textarea>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookTable;
