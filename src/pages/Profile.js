import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/store';

const Profile = () => {
  const [orderItemsDetails, setOrderItemsDetails] = useState([]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Fetch user profile when the component mounts
    useAuthStore.getState().fetchUserProfile()
      .then((userProfile) => {
        console.log('User Profile:', userProfile);
      })
      .catch((error) => {
        console.error('Failed to fetch user profile:', error);
      });
  }, []);

  useEffect(() => {
    if (user && user.previousOrders) {
      const fetchOrderItemsDetails = async () => {
        const itemsDetails = await Promise.all(user.previousOrders.map(async (order) => {
          console.log("Order items:", order.items); // Log order items
          const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
            try {
              console.log("Fetching product for item with productId:", item.product); // Log product
              const product = await useAuthStore.getState().fetchProductById(item.product); // Use item.product
              return { ...item, product };
            } catch (error) {
              console.error('Failed to fetch product details:', error);
              return { ...item, product: null };
            }
          }));
          return { ...order, items: itemsWithDetails };
        }));
        setOrderItemsDetails(itemsDetails);
      };
      
      fetchOrderItemsDetails();
    }
  }, [user]);
  



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Check if the user is logged in */}
      {user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-semibold mb-4">User Profile</h2>
          <p className="text-lg mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Email:</span> <a href={`mailto:${user.email}`}>{user.email}</a></p>
          <h3 className="text-xl font-semibold mb-2">Previous Orders</h3>
          <br />
          <ul>
            {orderItemsDetails.map((order) => (
              <li key={order._id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-lg"><span className="font-semibold">Order ID:</span> {order._id}</p>
                <p className={`text-lg ${order.payment === 'pending' ? 'text-red-500' : 'text-green-500'}`}><span className="font-semibold">Payment Status:</span> {order.payment}</p>
                <p className={`text-lg ${order.status === 'delivered' ? 'text-green-500' : 'text-orange-500'}`}><span className="font-semibold">Order Status:</span> {order.status}</p>
                {/* Display order items */}
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">Order Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-lg"><span className="font-semibold">Product:</span> {item.product ? item.product.name : 'Product not available'}</p>
                      <p className="text-lg"><span className="font-semibold">Quantity:</span> {item.quantity}</p>
                      {item.product && item.product.price ? (
                        <p className="text-lg"><span className="font-semibold">Price:</span> ${item.product.price.toFixed(2)}</p>
                      ) : (
                        <p className="text-lg"><span className="font-semibold">Price:</span> Price not available</p>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg">You are not logged in.</p>
          <p className="text-lg">Please sign in to view your profile.</p>
        </div>
      )}

      {/* Warning snippet */}
      <div className="bg-yellow-200 rounded-lg shadow-md p-6 mt-8">
        <p className="text-lg font-semibold">Contact Email For Orders Related Problems</p>
        <p className="text-lg">For any issues related to orders, changes in email, or password, please email us at <a href="mailto:mewadamarmik@gmail.com">mewadamarmik@gmail.com</a></p>
        {/* Add additional information or contact details as needed */}
      </div>
    </div>
  );
};

export default Profile;
