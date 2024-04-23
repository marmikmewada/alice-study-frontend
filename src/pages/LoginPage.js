import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/store'; // Import the store itself

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigate();
  const { signInUser } = useAuthStore();
  const {setUser} = useAuthStore();

  const handleSignIn = async () => {
    try {
      const userData = { email, password };
      const response = await signInUser(userData); // Await the promise
      setUser(response);
  
      // Destructure only if you need user data later
      // const { user } = response; 
  
      navigation('/'); // Redirect to home page on success
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleSignIn}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </div>
      <div className="mt-4 text-sm">
        <p>
          Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
