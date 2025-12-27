import React from 'react';

export const PromoBanner: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white py-6 px-4 rounded-lg mb-8 flex items-center justify-between">
    <span className="text-2xl font-bold">Holiday Sale! Up to 50% Off</span>
    <button className="bg-white text-primary-700 font-semibold px-4 py-2 rounded shadow">
      Shop Now
    </button>
  </div>
);
