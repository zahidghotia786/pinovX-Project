import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, ChevronDown, Settings, Shield, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
const navigate = useNavigate();  
  // Refs for dropdowns to detect clicks outside
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (hasUnreadNotifications) {
      setHasUnreadNotifications(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setNotificationsOpen(false);
    navigate('/'); // You'll need to add this back with your router
  };

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: 'KYC Document Verified',
      message: 'Your passport document has been approved',
      time: '2 minutes ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'Profile Update Required',
      message: 'Please update your contact information',
      time: '1 hour ago',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'Security Alert',
      message: 'New login detected from Chrome browser',
      time: '3 hours ago',
      type: 'info',
      unread: false
    },
    {
      id: 4,
      title: 'Document Pending Review',
      message: 'Your driver license is under review',
      time: '1 day ago',
      type: 'pending',
      unread: false
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'pending':
        return '⏳';
      default:
        return '📢';
    }
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) && 
        notificationsRef.current && !notificationsRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={'/'} className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">KYC Portal</span>
                <div className="text-xs text-white/70">Secure Verification</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {/* <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2.5 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-semibold">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {notifications.filter(n => n.unread).length} new
                      </span>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div> */}

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.firstName + " " + user?.lastName || 'User'}</div>
                  <div className="text-xs text-white/70">{user?.email || 'user@example.com'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  {/* User Info Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user?.firstName + " " + user?.lastName || 'User Name'}</div>
                        <div className="text-sm text-gray-600">{user?.email || 'user@example.com'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* <div
                      className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                    
                    <div
                      className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </div> */}

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;