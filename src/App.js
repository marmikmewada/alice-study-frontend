import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import Cart from './pages/Cart';
import useAuthStore from './store/store';
import ThankYou from './pages/ThankYou';
import SingleProduct from './pages/SingleProduct'; // Import SingleProduct component
import Admin from './pages/Admin';
import AdminOrder from './pages/AdminPages/AdminOrder';

const App = () => {
  const { user, loadingUser, setUser, fetchUserCart } = useAuthStore();

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const token = await localStorage.getItem('token');
        if (token) {
          setUser({ isAuthenticated: true });
          const userData = await fetch(`http://localhost:5000/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => response.json());
          setUser(userData);
          await fetchUserCart(userData._id);
        }
      } catch (error) {
        console.error('Error initializing store:', error);
      }
    };

    initializeStore();
  }, [fetchUserCart, setUser]);

  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route
            path="/cart"
            element={
              loadingUser ? (
                <p>Loading user data...</p>
              ) : user ? (
                <Cart />
              ) : (
                <p>Please log in to access your cart.</p>
              )
            }
          />
          {/* Add Route for Single Product Page */}
          <Route path="/single/:productId" element={<SingleProduct />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
