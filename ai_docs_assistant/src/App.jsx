// src/App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { setTheme, toggleSidebar } from './store/slices/uiSlice';
import { FaUser, FaFileAlt, FaComments, FaCog, FaSignOutAlt, FaSun, FaMoon, FaBars } from 'react-icons/fa';

// Theme configuration for Tailwind
const themeConfig = {
  light: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    sidebar: 'bg-white border-r border-gray-200',
    card: 'bg-white border border-gray-200',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    sidebar: 'bg-gray-800 border-r border-gray-700',
    card: 'bg-gray-800 border border-gray-700',
  },
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const theme = useSelector((state) => state.ui.theme);
  const currentView = useSelector((state) => state.ui.currentView);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaFileAlt /> },
    { id: 'documents', label: 'Documents', icon: <FaFileAlt /> },
    { id: 'chat', label: 'AI Chat', icon: <FaComments /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  if (!sidebarOpen) return null;

  return (
    <div className={`${themeConfig[theme].sidebar} w-64 min-h-screen transition-all duration-300`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaFileAlt /> Naija AI Assistant
        </h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => dispatch({ type: 'ui/setCurrentView', payload: item.id })}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === item.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.ui.theme);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className={`${themeConfig[theme].card} p-4 flex items-center justify-between shadow-sm`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <FaBars className="text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold">Naija AI Document Assistant</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        {user && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

const DashboardView = () => {
  const documents = useSelector((state) => state.document.documents);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Documents</h3>
          <p className="text-3xl font-bold">{documents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Welcome Back</h3>
          <p className="text-xl font-bold">{user?.name || 'Guest'}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">AI Assistant Status</h3>
          <p className="text-xl font-bold">Online</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
        <div className="space-y-3">
          {documents.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaFileAlt className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                doc.status === 'processed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const currentView = useSelector((state) => state.ui.currentView);
  const theme = useSelector((state) => state.ui.theme);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`${themeConfig[theme].background} min-h-screen ${themeConfig[theme].text}`}>
      <div className="flex">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
          <Header />
          <main>
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;