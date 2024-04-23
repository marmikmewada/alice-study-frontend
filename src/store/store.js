import create from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userId: null,
  user: null,
  cart: [],
  loadingUser: false,
  userRole: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (userData) => set({ user: userData }),

  signOut: () => {
    set({ isAuthenticated: false, userId: null, user: null, cart: [] });
    localStorage.removeItem('token');
  },

  signInUser: async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Sign in failed');
      }

      const { user, token } = await response.json();

      if (!token) {
        throw new Error('Missing token in response');
      }

      console.log('User data after sign in:', user);
      set({ userId: user._id, user, isAuthenticated: true, userRole: user.role });
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);

      return user;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  },



  fetchUserProfile: async (userId) => {
    try {
      set({ loadingUser: true });
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userProfile = await response.json();
      set({ user: userProfile, loadingUser: false });
      return userProfile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ loadingUser: false });
      return null;
    }
  },

  fetchUserCart: async (userId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found for fetching cart');
        return;
      }

      const response = await fetch(`http://localhost:5000/carts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user cart');
      }

      const cart = await response.json();
      set({ cart });
    } catch (error) {
      console.error('Get user cart failed:', error);
    }
  },

  addItemToCart: async (userId, productId, quantity) => {
    try {
      const response = await fetch('http://localhost:5000/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const { message, cart } = await response.json();
      set({ cart });

      console.log(message);
    } catch (error) {
      console.error('Add item to cart failed:', error);
    }
  },

  increaseCartItemQuantity: async (userId, productId) => {
    try {
      const response = await fetch(`http://localhost:5000/carts/increase-quantity/${userId}/${productId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to increase item quantity in cart');
      }

      const { message, cart } = await response.json();
      set({ cart });

      console.log(message);
    } catch (error) {
      console.error('Increase item quantity failed:', error);
    }
  },

  decreaseCartItemQuantity: async (userId, productId) => {
    try {
      const response = await fetch(`http://localhost:5000/carts/decrease-quantity/${userId}/${productId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to decrease item quantity in cart');
      }

      const { message, cart } = await response.json();
      set({ cart });

      console.log(message);
    } catch (error) {
      console.error('Decrease item quantity failed:', error);
    }
  },

  removeItemFromCart: async (userId, productId) => {
    try {
      const response = await fetch(`http://localhost:5000/carts/remove/${userId}/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const { message, cart } = await response.json();
      set({ cart });

      console.log(message);
    } catch (error) {
      console.error('Remove item from cart failed:', error);
    }
  },

  emptyCart: async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/carts/remove-all/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to empty cart');
      }

      const { message, cart } = await response.json();
      set({ cart });

      console.log(message);
    } catch (error) {
      console.error('Empty cart failed:', error);
    }
  },

  getAllProducts: async () => {
    try {
      const response = await fetch('http://localhost:5000/products/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch all products');
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Failed to fetch all products:', error);
      return [];
    }
  },
  fetchProductById: async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const product = await response.json();
      return product;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  },
  

  placeOrder: async (userId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
  
      const { message } = await response.json();
      console.log(message);
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  },
  

  searchProducts: async (keyword) => {
    try {
      const response = await fetch('http://localhost:5000/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },

// Inside initializeStore function
initializeStore: async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, set isAuthenticated to true
      set({ isAuthenticated: true });

      // Set the token in the store
      set({ token });

      // Retrieve user role from local storage
      const userRole = localStorage.getItem('userRole');
      console.log(userRole);

      // If user role exists, set it in the store
      if (userRole) {
        set({ userRole }); // This line sets the userRole in the store
      } else {
        // If user role doesn't exist in local storage, fetch user profile to get the role
        const userId = localStorage.getItem('userId');
        if (userId) {
          await useAuthStore.getState().fetchUserProfile(userId);
          // After fetching the user profile, userRole should be updated in the store
          const updatedUserRole = useAuthStore.getState().userRole; // Fetch the updated userRole
          set({ userRole: updatedUserRole }); // Set the updated userRole in the store
        }
      }
    }
  } catch (error) {
    console.error('Error initializing store:', error);
  }
},

  
  

   // Function to create a review
   createReview: async (userId, productId, rating, comment) => {
    try {
      const response = await fetch('http://localhost:5000/reviews/createreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId, productId, rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to create review');
      }

      const { message, review } = await response.json();
      console.log(message);
      return review;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  },

  // Function to get all reviews for a product
  getAllReviewsForProduct: async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to get reviews for product');
      }
      const reviews = await response.json();
      return reviews;
    } catch (error) {
      console.error('Failed to get reviews for product:', error);
      return [];
    }
  },

  // Function to fetch all reviews as an admin
  fetchAllReviews: async () => {
    try {
      const response = await fetch('http://localhost:5000/reviews/user/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all reviews');
      }

      const reviews = await response.json();
      return reviews;
    } catch (error) {
      console.error('Failed to fetch all reviews:', error);
      return [];
    }
  },

  // Function to delete a review as an admin
  deleteReview: async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      const { message } = await response.json();
      console.log(message);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  },

   // Function to create a product as an admin
   createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://localhost:5000/products/createproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const { message, product } = await response.json();
      console.log(message);
      return product;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  // Function to delete a product as an admin
  deleteProduct: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const { message } = await response.json();
      console.log(message);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },


  // Function to update the payment status of an order (admin only)
  updatePaymentStatus: async (orderId, payment) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://localhost:5000/orders/updatepaystatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, payment }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const { message, order } = await response.json();
      console.log(message);
      return order;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw error;
    }
  },

  // Function to fetch all orders (admin only)
  fetchAllOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://localhost:5000/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all orders');
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      return [];
    }
  },

  // Function to update the status of an order (admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://localhost:5000/orders/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const { message, order } = await response.json();
      console.log(message);
      return order;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

  uploadLogo: async (logoFile) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await fetch('http://localhost:5000/logoBanner/upload-logo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      console.log('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  // Function to fetch logo
  getLogo: async () => {
    try {
      const response = await fetch('http://localhost:5000/logoBanner/logo');

      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching logo:', error);
      throw error;
    }
  },

  // Function to upload banner images
  uploadBannerImages: async (bannerFiles) => {
    try {
      const formData = new FormData();
      bannerFiles.forEach((file) => {
        formData.append('banner', file);
      });

      const response = await fetch('http://localhost:5000/logoBanner/upload-banner', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload banner images');
      }

      console.log('Banner images uploaded successfully');
    } catch (error) {
      console.error('Error uploading banner images:', error);
      throw error;
    }
  },

  // Function to fetch banner images
  getBannerImages: async () => {
    try {
      const response = await fetch('http://localhost:5000/logoBanner/banner');

      if (!response.ok) {
        throw new Error('Failed to fetch banner images');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching banner images:', error);
      throw error;
    }
  },

}));

(async () => {
  try {
    const token = await localStorage.getItem('token');
    if (token) {
      useAuthStore.getState().initializeStore();
    }
  } catch (error) {
    console.error('Error initializing store:', error);
  }
})();

export default useAuthStore;
