import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utilis/AuthProvider';
import { useUserDetails } from '../../Utilis/UserDetails';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { userDetails } = useUserDetails();

  const handleLogout = () => {
    logout();
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleOutsideClick = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <div className='w-full bg-white shadow-md border-b border-gray-200'>
      {/* Main Navbar Container - Fixed Padding */}
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6'>
        <div className='flex items-center justify-between h-16'>
          
          {/* 👤 User Profile (Left) - Compact on Mobile */}
          <div className='relative flex-shrink-0'>
            <button
              onClick={toggleUserMenu}
              className='flex items-center space-x-2 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <div className='w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200'>
                <span className='text-blue-600 font-semibold text-sm sm:text-lg'>
                  {userDetails.userName?.charAt(0) || '👤'}
                </span>
              </div>
              {/* Hide user details on small screens */}
              <div className='hidden lg:block text-left'>
                <p className='text-sm font-medium text-gray-700'>
                  {userDetails.userName || 'User'}
                </p>
                <p className='text-xs text-gray-500'>
                  {userDetails.email || 'user@example.com'}
                </p>
              </div>
              <svg className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div className='fixed inset-0 z-10' onClick={handleOutsideClick}></div>
                <div className='absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20'>
                  {/* User Info Header */}
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                        <span className='text-blue-600 font-semibold text-xl'>
                          {userDetails.userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>{userDetails.userName || 'User Name'}</p>
                        <p className='text-sm text-gray-500'>{userDetails.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='py-1'>
                    <Link to='/account' className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors' onClick={() => setIsUserMenuOpen(false)}>
                      <span className='mr-3 text-lg'>⚙️</span>
                      Account Settings
                    </Link>
                    <div className='border-t border-gray-100 my-1'></div>
                    <button onClick={handleLogout} className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'>
                      <span className='mr-3 text-lg'>🚪</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 🏷️ Logo/Brand (Center) - Responsive */}
          <Link to='/home' className='flex items-center space-x-1 sm:space-x-2 flex-shrink-0'>
            <span className='text-xl sm:text-2xl'>💰</span>
            <span className='text-lg sm:text-xl font-bold text-gray-800'>ExpenseMate</span>
          </Link>

          {/* 🧭 Desktop Navigation (Right) - Hidden on smaller screens */}
          <nav className='hidden xl:flex items-center space-x-4'>
            <Link to='/home' className='flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors px-2 py-2 rounded-md hover:bg-gray-50'>
              <span className='text-base'>🏠</span>
              <span className='text-sm'>Home</span>
            </Link>
            <Link to='/expenses/report' className='flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors px-2 py-2 rounded-md hover:bg-gray-50'>
              <span className='text-base'>💰</span>
              <span className='text-sm'>Expenses</span>
            </Link>
            <Link to='/expense/analytics' className='flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors px-2 py-2 rounded-md hover:bg-gray-50'>
              <span className='text-base'>📊</span>
              <span className='text-sm'>Analytics</span>
            </Link>
          </nav>

          {/* 📱 Mobile Menu Button (Right) */}
          <div className='xl:hidden flex-shrink-0'>
            <button
              onClick={toggleMobileMenu}
              className='p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 transition-colors'
            >
              <span className='text-lg'>{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='xl:hidden border-t border-gray-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 py-2 space-y-1'>
            <Link
              to='/home'
              className='flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-50 transition-colors'
              onClick={toggleMobileMenu}
            >
              <span className='text-lg'>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to='/expenses'
              className='flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-50 transition-colors'
              onClick={toggleMobileMenu}
            >
              <span className='text-lg'>💰</span>
              <span>Expenses</span>
            </Link>
            <Link
              to='/analytics'
              className='flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-50 transition-colors'
              onClick={toggleMobileMenu}
            >
              <span className='text-lg'>📊</span>
              <span>Analytics</span>
            </Link>
            <Link
              to='/reports'
              className='flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-50 transition-colors'
              onClick={toggleMobileMenu}
            >
              <span className='text-lg'>📄</span>
              <span>Reports</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
