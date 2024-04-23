import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/store";
import Notification from "../components/Notification"; // Import the custom Notification component

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showLoadAllButton, setShowLoadAllButton] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [notification, setNotification] = useState(null); // State for notification
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userData = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const {
    getAllProducts,
    searchProducts,
    fetchUserProfile,
    fetchUserCart,
    addItemToCart,
  } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();
        await fetchAllProducts();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const prevUserId = userData?._id;
    const userId = userData?._id;

    if (isAuthenticated) {
      if (!userData || !prevUserId || prevUserId !== userId) {
        fetchUserData();
      }
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticated, userData]);

  const fetchAllProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setSearchResults(allProducts);
      setShowLoadAllButton(false);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchUserData = async () => {
    if (isAuthenticated && userData) {
      try {
        setLoadingUserData(true);
        const userId = userData._id;
        console.log("Fetched user ID:", userId);
        await fetchUserProfile(userId);
        if (userId) {
          await fetchUserCart(userId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUserData(false);
      }
    }
  };

  const handleSearch = async () => {
    try {
      let products = [];
      if (searchTerm.trim() === "") {
        products = await searchProducts("");
        setShowLoadAllButton(true);
      } else {
        products = await searchProducts(searchTerm);
        setShowLoadAllButton(true);
      }
      setSearchResults(products);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      if (!isAuthenticated) {
        navigate("/signin");
        return;
      }

      const userId = userData?._id;
      if (!userId) {
        console.error("User ID not yet available");
        return;
      }
      const quantity = 1;
      await addItemToCart(userId, productId, quantity);
      setNotification({ type: "success", message: "Product added to cart!" }); // Set success notification
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setNotification({ type: "error", message: "Failed to add product to cart" }); // Set error notification
    }
  };

  const handleLoadAllProducts = async () => {
    try {
      await fetchAllProducts();
    } catch (error) {
      console.error("Error loading all products:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />} {/* Display the notification component */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 w-full md:w-auto mb-4 md:mb-0"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Search
        </button>
        {showLoadAllButton && (
          <button
            onClick={handleLoadAllProducts}
            className="ml-2 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Load All Products
          </button>
        )}
      </div>

      <h1 className="text-3xl font-semibold mb-6">Search Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {searchResults.map((product) => (
          <Link key={product._id} to={`/single/${product._id}`}>
            <div
              className="border border-gray-200 rounded-md overflow-hidden bg-white cursor-pointer transition duration-300 hover:shadow-lg"
            >
              <div className="relative h-64">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-center p-4">No images available</p>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-lg font-semibold">${product.price}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                  className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loadingUserData && <p className="mt-8 text-center">Loading user data...</p>}
    </div>
  );
};

export default Home;
