import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";
import {
  AboutUs,
  Chef,
  FindUs,
  Footer,
  Gallery,
  Header,
  Intro,
  Laurels,
  SpecialMenu,
} from "./container";
import { Navbar } from "./components";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTable from "./pages/BookTable";
import Booking from "./pages/Booking";

import "./App.css";

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <AboutUs />
            <SpecialMenu />
            <Chef />
            <Intro />
            <Laurels />
            <Gallery />
            <FindUs />
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/book-table"
        element={
          <ProtectedRoute>
            <BookTable />
          </ProtectedRoute>
        }
      />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  </>
);

export default App;
