import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import InteractiveBackground from './components/InteractiveBackground';
import { AuthProvider, useAuth } from './components/AuthContext';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import History from './pages/History';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';

function MainAppContent() {
  const [activePage, setActivePage] = useState('landing');
  const { user } = useAuth();

  // Render active page component
  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <Landing setActivePage={setActivePage} />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'signup':
        return <Signup setActivePage={setActivePage} />;
      case 'dashboard':
        return user ? <Dashboard setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'analyzer':
        return <Analyzer setActivePage={setActivePage} />;
      case 'history':
        return user ? <History setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'admin':
        return user?.role === 'admin' ? <Admin setActivePage={setActivePage} /> : <Landing setActivePage={setActivePage} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Landing setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-white bg-transparent relative z-10">
      {/* Dynamic Interactive Futuristic Background */}
      <InteractiveBackground />

      {/* Header Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Core Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {renderPage()}
      </main>

      {/* AI Assistant Agent Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
