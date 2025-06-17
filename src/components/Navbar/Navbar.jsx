import React, { useState, useContext } from "react";

import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import images from "../../constants/images";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { isLoggedIn, setIsLoggedIn, Logout } = useContext(AuthContext);
  const location = useLocation();

  const minimalNav =
    location.pathname === "/login" || location.pathname === "/register";

  const AuthButtons = () => {
    if (minimalNav) return null;

    return isLoggedIn ? (
      <>
        <Link
          to="/book-table"
          className="p__opensans"
          style={{ marginLeft: "1rem" }}
        >
          Book Table
        </Link>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="p__opensans"
          style={{ marginRight: "1rem" }}
        >
          Log In
        </Link>
        <Link to="/register" className="p__opensans">
          Register
        </Link>
      </>
    );
  };

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
            <li className="p__opensans">
              <a href="#about">About</a>
            </li>
            <li className="p__opensans">
              <a href="#menu">Menu</a>
            </li>
            <li className="p__opensans">
              <a href="#awards">Awards</a>
            </li>
            <li className="p__opensans">
              <a href="#contact">Contact</a>
            </li>
          </>
        )}
      </ul>

      <div className="app__navbar-login">
        <AuthButtons />
      </div>

      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(!toggleMenu)}
        />

        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen_links">
              <li className="p__opensans">
                <Link to="/" onClick={() => setToggleMenu(false)}>
                  Home
                </Link>
              </li>

              {!minimalNav && (
                <>
                  <li className="p__opensans">
                    <a href="#about" onClick={() => setToggleMenu(false)}>
                      About
                    </a>
                  </li>
                  <li className="p__opensans">
                    <a href="#menu" onClick={() => setToggleMenu(false)}>
                      Menu
                    </a>
                  </li>
                  <li className="p__opensans">
                    <a href="#awards" onClick={() => setToggleMenu(false)}>
                      Awards
                    </a>
                  </li>
                  <li className="p__opensans">
                    <a href="#contact" onClick={() => setToggleMenu(false)}>
                      Contact
                    </a>
                  </li>

                  {isLoggedIn ? (
                    <>
                      <li className="p__opensans">
                        <Link
                          to="/book-table"
                          onClick={() => setToggleMenu(false)}
                        >
                          Book Table
                        </Link>
                      </li>
                      <li className="p__opensans">
                        <Link
                          to="/"
                          onClick={() => {
                            setToggleMenu(false);
                            setIsLoggedIn(false);
                            Logout();
                          }}
                        >
                          Log out
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="p__opensans">
                        <Link to="/login" onClick={() => setToggleMenu(false)}>
                          Log In
                        </Link>
                      </li>
                      <li className="p__opensans">
                        <Link
                          to="/register"
                          onClick={() => setToggleMenu(false)}
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
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
