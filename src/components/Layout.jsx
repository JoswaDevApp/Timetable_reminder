import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiBell, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    Admin: [
      { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
      { name: 'Timetable', path: '/admin/timetable', icon: <FiCalendar /> },
      { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
      { name: 'Notifications', path: '/admin/notifications', icon: <FiBell /> },
      { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
    ],
    Teacher: [
      { name: 'Today', path: '/teacher', icon: <FiHome /> },
      { name: 'Weekly Timetable', path: '/teacher/weekly', icon: <FiCalendar /> },
      { name: 'Notifications', path: '/teacher/notifications', icon: <FiBell /> },
    ],
    Student: [
      { name: 'Today', path: '/student', icon: <FiHome /> },
      { name: 'Weekly Timetable', path: '/student/weekly', icon: <FiCalendar /> },
      { name: 'Notifications', path: '/student/notifications', icon: <FiBell /> },
    ]
  };

  const navLinks = user ? menuItems[user.role] : [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-bg text-dark-text flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-white/10 text-primary-500 tracking-wider">
          UniTime
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="font-bold text-lg text-primary-600">UniTime</div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900">
               <FiLogOut size={20} />
            </button>
        </header>
        
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
