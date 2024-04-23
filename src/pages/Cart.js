import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/store";

const Cart = () => {
  const user = useAuthStore((state) => state.user);
  const cart = useAuthStore((state) => state.cart);
  const fetchUserCart = useAuthStore((state) => state.fetchUserCart);
  const placeOrder = useAuthStore((state) => state.placeOrder);
  const emptyCart = useAuthStore((state) => state.emptyCart);
  const increaseCartItemQuantity = useAuthStore(
    (state) => state.increaseCartItemQuantity
  );
  const decreaseCartItemQuantity = useAuthStore(
    (state) => state.decreaseCartItemQuantity
  );
  const removeItemFromCart = useAuthStore(
    (state) => state.removeItemFromCart
  );
  const navigate = useNavigate();

  const [products, setProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?._id;
        if (userId) {
          await fetchUserCart(userId);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [user, fetchUserCart]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = cart.items.map((item) => item.product);
        const productsData = {};
        for (const productId of productIds) {
          const response = await fetch(
            `http://localhost:5000/products/${productId}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch product details for product ID: ${productId}`
            );
          }
          const product = await response.json();
          productsData[productId] = {
            name: product.name,
            price: product.price,
          };
        }
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (cart.items && cart.items.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  useEffect(() => {
    let total = 0;
    if (cart.items && Array.isArray(cart.items) && products) {
      cart.items.forEach((item) => {
        total += (products[item.product]?.price || 0) * item.quantity;
      });
    }
    setTotalAmount(total);
  }, [cart, products]);

  const emptyCartHandler = async () => {
    try {
      const userId = user?._id;
      if (userId) {
        await emptyCart(userId);
        setNotification({
          message: "Cart emptied successfully",
          color: "yellow",
        });
      }
    } catch (error) {
      console.error("Failed to empty cart:", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const userId = user?._id;
      if (userId) {
        await placeOrder(userId);
        await emptyCart(userId);
        navigate("/thankyou");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const handleIncreaseQuantity = (productId) => {
    const userId = user?._id;
    if (userId) {
      increaseCartItemQuantity(userId, productId);
      setNotification({
        message: "Item quantity increased",
        color: "green", // Set notification color to green
      });
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const userId = user?._id;
    if (userId) {
      decreaseCartItemQuantity(userId, productId);
      setNotification({
        message: "Item quantity decreased",
        color: "yellow",
      });
    }
  };

  const handleRemoveItem = (productId) => {
    const userId = user?._id;
    if (userId) {
      removeItemFromCart(userId, productId);
      setNotification({
        message: "Item removed from cart",
        color: "yellow",
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div
          className={`bg-${notification.color || "yellow"}-500 text-white p-4 mb-4 rounded-md`}
        >
          {notification.message}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      <div className="mb-4">
        <p className="font-semibold text-lg">
          Total Amount: ${totalAmount.toFixed(2)}
        </p>
      </div>
      {cart.items && cart.items.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-4">Items in Cart:</h3>
          <ul>
            {cart.items.map((item, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {products[item.product]
                        ? products[item.product].name
                        : ""}
                    </p>
                    <p className="text-gray-600">
                      Price: ${products[item.product]
                        ? products[item.product].price
                        : 0}
                    </p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    {item.quantity > 1 && (
                      <button
                        onClick={() => handleDecreaseQuantity(item.product)}
                        className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 mr-2"
                      >
                        -
                      </button>
                    )}
                    <button
                      onClick={() => handleIncreaseQuantity(item.product)}
                      className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 mr-2"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.product)}
                      className="bg-red-500 text-white rounded-full px-3 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={emptyCartHandler}
            className="bg-gray-500 text-white rounded-full px-4 py-2 mt-4 mr-2"
          >
            Empty Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white rounded-full px-4 py-2 mt-4"
          >
            Place Order
          </button>
        </div>
      ) : (
        <p className="text-lg">Cart is empty</p>
      )}
    </div>
  );
};

export default Cart;













// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import Link and useNavigate
// import useAuthStore from '../store/store';

// const Cart = () => {
//   const user = useAuthStore((state) => state.user);
//   const cart = useAuthStore((state) => state.cart);
//   const fetchUserCart = useAuthStore((state) => state.fetchUserCart);
//   const placeOrder = useAuthStore((state) => state.placeOrder);
//   const [isLoadingCart, setIsLoadingCart] = useState(false);
//   const [products, setProducts] = useState({});
//   const [totalAmount, setTotalAmount] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const userId = user?._id;
//         if (userId) {
//           setIsLoadingCart(true);
//           console.log('Fetching cart...');
//           await fetchUserCart(userId);
//           setIsLoadingCart(false);
//           console.log('Cart fetched successfully.');
//         }
//       } catch (error) {
//         console.error('Failed to fetch cart:', error);
//         setIsLoadingCart(false);
//       }
//     };

//     fetchCart();
//   }, [user, fetchUserCart]);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const productIds = cart.items.map(item => item.product);
//         const productsData = {};
//         for (const productId of productIds) {
//           const response = await fetch(`http://localhost:5000/products/${productId}`);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch product details for product ID: ${productId}`);
//           }
//           const product = await response.json();
//           productsData[productId] = { name: product.name, price: product.price };
//         }
//         setProducts(productsData);
//       } catch (error) {
//         console.error('Failed to fetch product details:', error);
//       }
//     };

//     if (cart.items && cart.items.length > 0) {
//       fetchProductDetails();
//     }
//   }, [cart]);

//   useEffect(() => {
//     let total = 0;
//     if (cart.items && Array.isArray(cart.items) && products) {
//       cart.items.forEach(item => {
//         total += (products[item.product]?.price || 0) * item.quantity;
//       });
//     }
//     setTotalAmount(total);
//   }, [cart, products]);

//   const emptyCart = async () => {
//     try {
//       const userId = user?._id;
//       if (userId) {
//         console.log('Emptying cart...');
//         await useAuthStore.getState().emptyCart(userId);
//         console.log('Cart emptied successfully.');
//       }
//     } catch (error) {
//       console.error('Failed to empty cart:', error);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     try {
//       const userId = user?._id;
//       if (userId) {
//         console.log('Placing order...');
//         await placeOrder(userId);
//         console.log('Order placed successfully.');
//         await emptyCart();
//         navigate('/thankyou');
//       }
//     } catch (error) {
//       console.error('Failed to place order:', error);
//     }
//   };

//   return (
//     <>
//       <br />
//       <br />
//       <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-4">
//         <h2 className="text-lg font-semibold mb-4">Cart</h2>
//         <div className="mb-4">
//           <p className="font-semibold">Total Amount: ${totalAmount.toFixed(2)}</p>
//         </div>
//         {isLoadingCart ? (
//           <p>Loading Cart...</p>
//         ) : cart && cart.items && cart.items.length > 0 ? (
//           <div>
//             <h3 className="font-semibold mb-2">Items in Cart:</h3>
//             <ul>
//               {cart.items.map((item) => (
//                 <li key={item.product} className="flex items-center justify-between border-b pb-2 mb-2">
//                   <div>
//                     <p className="font-semibold">Product Name: {products[item.product]?.name}</p>
//                     <p>Price: ${products[item.product]?.price}</p>
//                     <p>Quantity: {item.quantity}</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <button onClick={emptyCart} className="bg-gray-500 text-white rounded-full px-4 py-2 mt-4 block">Empty Cart</button>
//             <button onClick={handlePlaceOrder} className="bg-green-500 text-white rounded-full px-4 py-2 mt-4 block">Place Order</button>
//             {/* <Link to="/thankyou" className="text-blue-500 block mt-2">Go to Thank You page</Link> */}
//           </div>
//         ) : cart && cart.items && cart.items.length === 0 ? (
//           <p>Cart is empty</p>
//         ) : (
//           <p>No user data available</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Cart;
