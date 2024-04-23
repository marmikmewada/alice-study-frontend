import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/store"; // Import your store hook

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  useEffect(() => {
    // Fetch all orders when the component mounts
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const allOrders = await useAuthStore.getState().fetchAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleUpdatePaymentStatus = async (orderId) => {
    try {
      await useAuthStore
        .getState()
        .updatePaymentStatus(orderId, selectedPaymentStatus);
      // After updating payment status, fetch all orders again to update the list
      fetchAllOrders();
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      await useAuthStore
        .getState()
        .updateOrderStatus(orderId, selectedOrderStatus);
      // After updating order status, fetch all orders again to update the list
      fetchAllOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Payment Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(
              (order) => (
                console.log("Order details:", order), // Add logging here
                (
                  <tr key={order.id} className="border-b border-gray-300">
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{order.status}</td>
                    <td className="py-2 px-4">{order.payment}</td>{" "}
                    {/* Updated to display payment status */}
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <select
                          className="bg-white border border-gray-300 rounded px-2 py-1"
                          value={selectedOrderStatus}
                          onChange={(e) =>
                            setSelectedOrderStatus(e.target.value)
                          }
                        >
                          <option value="">Select Order Status</option>
                          <option value="placed">Placed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                        >
                          Update Status
                        </button>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <select
                          className="bg-white border border-gray-300 rounded px-2 py-1"
                          value={selectedPaymentStatus}
                          onChange={(e) =>
                            setSelectedPaymentStatus(e.target.value)
                          }
                        >
                          <option value="">Select Payment Status</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                        <button
                          onClick={() => handleUpdatePaymentStatus(order._id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                        >
                          Update Payment Status
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrder;
