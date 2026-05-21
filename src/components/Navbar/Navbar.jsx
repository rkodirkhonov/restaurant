import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";

import images from "../../constants/images";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const minimalNav =
    location.pathname === "/login" || location.pathname === "/register";

  const closeMenu = () => setToggleMenu(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/");
  };

  const renderAuthLinks = (onNavigate) =>
    isLoggedIn ? (
      <>
        <Link to="/book-table" className="p__opensans" onClick={onNavigate}>
          Book Table
        </Link>
        <button
          type="button"
          className="p__opensans link-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </>
    ) : (
      <>
        <Link to="/login" className="p__opensans" onClick={onNavigate}>
          Log In
        </Link>
        <Link to="/register" className="p__opensans" onClick={onNavigate}>
          Register
        </Link>
      </>
    );

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.gericht} alt="app logo" />
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans">
          <Link to="/">Home</Link>
        </li>
        {!minimalNav && (
          <>
            <li className="p__opensans"><a href="#about">About</a></li>
            <li className="p__opensans"><a href="#menu">Menu</a></li>
            <li className="p__opensans"><a href="#awards">Awards</a></li>
            <li className="p__opensans"><a href="#contact">Contact</a></li>
          </>
        )}
      </ul>

      {!minimalNav && (
        <div className="app__navbar-login">{renderAuthLinks()}</div>
      )}

      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />

        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={closeMenu}
            />
            <ul className="app__navbar-smallscreen_links">
              <li className="p__opensans">
                <Link to="/" onClick={closeMenu}>Home</Link>
              </li>
              {!minimalNav && (
                <>
                  <li className="p__opensans"><a href="#about" onClick={closeMenu}>About</a></li>
                  <li className="p__opensans"><a href="#menu" onClick={closeMenu}>Menu</a></li>
                  <li className="p__opensans"><a href="#awards" onClick={closeMenu}>Awards</a></li>
                  <li className="p__opensans"><a href="#contact" onClick={closeMenu}>Contact</a></li>
                  <li className="p__opensans">{renderAuthLinks(closeMenu)}</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
