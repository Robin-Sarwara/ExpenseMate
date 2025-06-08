import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">💰</span>
              <span className="text-xl font-bold text-blue-400">ExpenseMate</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your personal finance companion. Track expenses, analyze spending patterns, 
              and achieve your financial goals with ease.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-xl">🐦</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-xl">📘</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-xl">💼</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-xl">🐱</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  🏠 Dashboard
                </Link>
              </li>
              <li>
                <Link to="/expenses/report" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  💰 Expenses
                </Link>
              </li>
              <li>
                <Link to="/expense/analytics" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  📊 Analytics
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  👤 Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">📍</span>
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Finance Street<br />
                    Business District<br />
                    New Delhi, 110001<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">📞</span>
                <a href="tel:+911234567890" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  +91 12345 67890
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">📧</span>
                <a href="mailto:hello@expensemate.com" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  hello@expensemate.com
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">⏰</span>
                <span className="text-gray-300 text-sm">
                  Mon - Fri: 9:00 AM - 6:00 PM IST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().toLocaleString(undefined, { year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })} ExpenseMate. All rights reserved. 
              <span className="ml-2">Made with ❤️ for better financial management.</span>
            </div>
            
            {/* Additional Links */}
            <div className="flex space-x-6 text-sm">
              <a href="#top" className="text-gray-400 hover:text-blue-400 transition-colors">
                ⬆️ Back to Top
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;