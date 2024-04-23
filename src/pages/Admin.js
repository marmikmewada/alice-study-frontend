import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-semibold text-center mb-8">Admin Panel</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Orders */}
          <Link to="/admin/orders" className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition duration-300 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1 3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3zm0 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8zm1 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm12-6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold">Orders</span>
          </Link>

          {/* Products */}
          <Link to="/admin/products" className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition duration-300 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4zm10 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-4-6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-4 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 14a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold">Products</span>
          </Link>

          {/* Reviews */}
          <Link to="/admin/reviews" className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition duration-300 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.732 1.648a1 1 0 0 1 1.045.141l4.95 4.5a1 1 0 0 1 .274.806l-.083 6.647a1 1 0 0 1-.571.894l-5.9 2.632a1 1 0 0 1-.726 0l-5.9-2.632a1 1 0 0 1-.571-.894l-.083-6.647a1 1 0 0 1 .274-.806l4.95-4.5a1 1 0 0 1 1.186-.045zm-.732 2.442L4.85 8.591l.074 5.886 4.1 1.826 4.1-1.826.075-5.886-4.95-4.501zM7.585 10a1 1 0 0 1 .707.293l1.414 1.414 1.414-1.414a1 1 0 1 1 1.414 1.414l-2.121 2.121a1 1 0 0 1-1.414 0L6.172 11.707a1 1 0 0 1 1.414-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold">Reviews</span>
          </Link>

          {/* Logo & Banner */}
          <Link to="/admin/logobanner" className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition duration-300 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.5 2.5a1 1 0 0 1 1.32-.95l14 5a1 1 0 0 1 .18 1.8l-6 3a1 1 0 0 1-1.18-.14l-4-3a1 1 0 0 1-.32-1.3zm1.32-.95A3 3 0 0 0 2 5v10a3 3 0 0 0 1.5 2.6l6 3a3 3 0 0 0 3 0l6-3A3 3 0 0 0 18 15V5a3 3 0 0 0-1.82-2.78l-6-2.5a3 3 0 0 0-3 0l-6 2.5z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold">Logo & Banner</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
