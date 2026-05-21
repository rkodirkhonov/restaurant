import React from "react";
import { Route, Routes } from "react-router-dom";

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
import ProtectedRoute from "./context/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTable from "./pages/BookTable";

import "./App.css";

const Home = () => (
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
);

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
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
    </Routes>
  </>
);

export default App;
