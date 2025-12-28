import React, { useState } from 'react';
import { Button, Modal } from '@e-commerce/ui-library';

interface WelcomePageProps {
  onSignupClick?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onSignupClick }) => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const scrollToPlatform = () => {
    document.getElementById('platform-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openApp = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-blue-600 dark:text-blue-400">3A Softwares</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Your Complete E-Commerce Platform Solution
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A modern, scalable, and feature-rich e-commerce platform built with cutting-edge technologies
              to help businesses grow and succeed in the digital marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button size="lg" variant="primary" className="shadow-lg hover:shadow-xl" onClick={scrollToPlatform}>
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="platform-features" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Platform Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Admin Portal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Portal</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Comprehensive dashboard to manage your entire e-commerce platform with powerful analytics and reporting tools.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>User & seller management</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>Real-time analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>Order tracking & management</span>
              </li>
            </ul>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => openApp('http://localhost:3001')}
            >
              Open Admin Portal
            </Button>
          </div>

          {/* Seller Portal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Seller Portal</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Easy-to-use interface for sellers to manage their products, inventory, and orders efficiently.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>Product catalog management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>Inventory tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>Sales analytics</span>
              </li>
            </ul>
            <Button 
              variant="primary" 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => openApp('http://localhost:3002')}
            >
              Open Seller Portal
            </Button>
          </div>

          {/* Customer Storefront */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Storefront</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Beautiful and responsive storefront providing seamless shopping experience for customers.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>Advanced product search</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>Secure checkout process</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>Order tracking</span>
              </li>
            </ul>
            <Button 
              variant="primary" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => openApp('http://localhost:3003')}
            >
              Open Storefront
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Sign up today and experience the power of our e-commerce platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-lg hover:shadow-xl bg-white text-blue-600 hover:bg-gray-100 border-0"
              onClick={onSignupClick}
            >
              Create Account
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="shadow-lg hover:shadow-xl text-white border-2 border-white hover:bg-white hover:text-blue-600"
              onClick={() => setShowSupportModal(true)}
            >
              Support
            </Button>
          </div>
        </div>
      </section>

      {/* Support Modal */}
      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="Contact Support"
        size="md"
      >
        <div className="space-y-6 py-2">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              We're Here to Help!
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Get in touch with our support team for any questions or assistance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email</h4>
                <a href="mailto:support@3asoftwares.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  support@3asoftwares.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Phone</h4>
                <a href="tel:+1234567890" className="text-green-700 dark:text-green-400 hover:underline font-semibold">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Business Hours</h4>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
