import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../store/store';

const Nav = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userRole = useAuthStore(state => state.userRole); // Access userRole from the store
  const signOut = useAuthStore(state => state.signOut);
  
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Function to determine if a given path is active
  const isActive = (path) => {
    return location.pathname === path ||  location.pathname.startsWith("/single/");
  };

  // Function to handle menu item click
  const handleMenuItemClick = () => {
    toggleMenu(); // Close the menu
  };

  console.log('Is Authenticated:', isAuthenticated);
  console.log('User Role:', userRole);

  return (
    <nav className="bg-blue-900 py-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-2xl">
          eCommerce
        </Link>
        <ul className="hidden md:flex items-center space-x-4">
          {(isActive('/profile') || isActive('/cart')) && (
            <li>
              <NavLink
                to="/"
                className="text-white hover:text-gray-300"
                activeClassName="font-bold"
              >
                Home
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <>
              {/* Check if userRole is admin */}
              {userRole === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    className="text-white hover:text-gray-300"
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              {/* Display regular navigation links for non-admin users */}
              {userRole !== 'admin' && (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className="text-white hover:text-gray-300"
                      activeClassName="font-bold"
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/cart"
                      className="text-white hover:text-gray-300"
                      activeClassName="font-bold"
                    >
                      Cart
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => {signOut();}}
                  className="text-white hover:text-gray-300"
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li>
              <Link
                to="/LoginPage"
                className="text-white hover:text-gray-300"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:text-gray-300"
          >
            {!showMenu ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="md:hidden bg-blue-900 absolute top-0 left-0 w-screen h-screen z-50">
          <div className="container mx-auto flex flex-col items-center justify-center h-full">
            <button
              onClick={toggleMenu}
              className="text-white absolute top-4 right-4 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Link to="/" className="text-white font-bold text-2xl mb-8" onClick={handleMenuItemClick}>
              eCommerce
            </Link>
            <ul className="flex flex-col items-center justify-center">
              {(isActive('/profile') || isActive('/cart')) && (
                <li>
                  <NavLink
                    to="/"
                    className="text-white hover:text-gray-300 py-2"
                    activeClassName="font-bold"
                    onClick={handleMenuItemClick}
                  >
                    Home
                  </NavLink>
                </li>
              )}
              {isAuthenticated && (
                <>
                  {userRole === 'admin' && (
                    <li>
                      <Link
                        to="/admin"
                        className="text-white hover:text-gray-300 py-2"
                        onClick={handleMenuItemClick}
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  {/* Display regular navigation links for non-admin users */}
                  {userRole !== 'admin' && (
                    <>
                      <li>
                        <NavLink
                          to="/profile"
                          className="text-white hover:text-gray-300 py-2"
                          activeClassName="font-bold"
                          onClick={handleMenuItemClick}
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/cart"
                          className="text-white hover:text-gray-300 py-2"
                          activeClassName="font-bold"
                          onClick={handleMenuItemClick}
                        >
                          Cart
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={() => {signOut(); handleMenuItemClick();}}
                      className="text-white hover:text-gray-300 py-2"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <li>
                  <Link
                    to="/LoginPage"
                    className="text-white hover:text-gray-300 py-2"
                    onClick={handleMenuItemClick}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
