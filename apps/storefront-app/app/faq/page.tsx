'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Orders & Shipping
  {
    id: 1,
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page. Click on the order you want to track to see real-time shipping updates.',
    category: 'Orders & Shipping',
  },
  {
    id: 2,
    question: 'What shipping options are available?',
    answer: 'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and International Shipping (7-14 business days). Free standard shipping is available on orders over ₹500.',
    category: 'Orders & Shipping',
  },
  {
    id: 3,
    question: 'Can I change or cancel my order?',
    answer: 'You can modify or cancel your order within 1 hour of placing it by contacting customer support. After this window, orders are processed and cannot be changed. However, you can always return items using our 30-day return policy.',
    category: 'Orders & Shipping',
  },
  {
    id: 4,
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 100 countries worldwide. International shipping costs and delivery times vary by location. Additional customs fees and import taxes may apply and are the responsibility of the customer.',
    category: 'Orders & Shipping',
  },
  // Returns & Refunds
  {
    id: 5,
    question: 'What is your return policy?',
    answer: 'We offer a hassle-free 30-day return policy. Items must be unused, in original condition with tags attached. We provide free return shipping labels for all US domestic returns. Refunds are processed within 3-5 business days of receiving your return.',
    category: 'Returns & Refunds',
  },
  {
    id: 6,
    question: 'How long does it take to get a refund?',
    answer: 'Once we receive your returned item, refunds are processed within 3-5 business days. Depending on your bank or card issuer, it may take an additional 5-10 business days for the refund to appear on your statement.',
    category: 'Returns & Refunds',
  },
  {
    id: 7,
    question: 'Can I exchange an item?',
    answer: 'We don\'t offer direct exchanges. If you need a different size, color, or product, please return the original item for a refund and place a new order. This ensures you get your preferred item faster.',
    category: 'Returns & Refunds',
  },
  {
    id: 8,
    question: 'What items cannot be returned?',
    answer: 'For hygiene and safety reasons, we cannot accept returns on cosmetics, personal care items, underwear, earrings, perishable goods, and gift cards once they\'ve been opened or used.',
    category: 'Returns & Refunds',
  },
  // Payment & Security
  {
    id: 9,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely with SSL encryption.',
    category: 'Payment & Security',
  },
  {
    id: 10,
    question: 'Is my payment information secure?',
    answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers. All transactions are processed through secure, PCI-compliant payment gateways.',
    category: 'Payment & Security',
  },
  {
    id: 11,
    question: 'Do you offer payment plans?',
    answer: 'Yes, we partner with payment providers to offer installment plans on eligible purchases over ₹1,000. You can select this option at checkout and complete the application process in minutes.',
    category: 'Payment & Security',
  },
  // Account & Profile
  {
    id: 12,
    question: 'Do I need an account to place an order?',
    answer: 'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, create wishlists, and enjoy faster checkout on future purchases.',
    category: 'Account & Profile',
  },
  {
    id: 13,
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a link to create a new password. If you don\'t receive the email within a few minutes, check your spam folder or contact support.',
    category: 'Account & Profile',
  },
  {
    id: 14,
    question: 'Can I update my account information?',
    answer: 'Yes! Log into your account and go to Profile Settings. You can update your name, email, phone number, and saved addresses at any time.',
    category: 'Account & Profile',
  },
  // Products
  {
    id: 15,
    question: 'Are your products authentic?',
    answer: 'Yes, all products sold on 3A Softwares are 100% authentic. We work directly with authorized distributors and verified sellers. Every product comes with a guarantee of authenticity.',
    category: 'Products',
  },
  {
    id: 16,
    question: 'How do I know my size?',
    answer: 'Each product page includes a detailed size guide. You can also check customer reviews for fit information. If you\'re still unsure, our customer support team is happy to help you choose the right size.',
    category: 'Products',
  },
  {
    id: 17,
    question: 'Can I add items to my wishlist?',
    answer: 'Yes! Click the heart icon on any product to add it to your wishlist. You can access your wishlist from your account dashboard or the heart icon in the header navigation.',
    category: 'Products',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
              <FontAwesomeIcon icon={faQuestionCircle} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about orders, shipping, returns, and more
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-8 border border-gray-200">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <FontAwesomeIcon icon={faQuestionCircle} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map(faq => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                  </div>
                  <FontAwesomeIcon
                    icon={openId === faq.id ? faChevronUp : faChevronDown}
                    className={`w-5 h-5 text-gray-400 ml-4 transition-transform ${
                      openId === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-purple-100 mb-6">
            Our customer support team is always here to help you!
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
