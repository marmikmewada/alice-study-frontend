import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-4">Thank You!</h2>
      <p className="text-lg mb-4">Thank you for placing your order with us.</p>
      <p className="text-lg mb-4">The details of your order will be available in your <Link to="/profile" className="text-blue-500">profile</Link> in case you would like to review the order status.</p>
      <p className="text-lg mb-4">You will receive an invoice via email from our official email. You can securely pay to confirm your order, and it will be shipped within 2-3 working days.</p>
      <p className="text-lg">Click <Link to="/home" className="text-blue-500">here</Link> to return to the homepage.</p>
    </div>
  );
};

export default ThankYou;
