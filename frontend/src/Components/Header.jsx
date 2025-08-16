import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Check authentication status
  const checkAuthStatus = () => {
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='));
    const isAuth = !!accessToken;
    
    // Only update state if it actually changed to prevent unnecessary re-renders
    if (isAuth !== isAuthenticated) {
      setIsAuthenticated(isAuth);
      console.log('Auth status updated:', isAuth);
    }
    
    return isAuth;
  };

  // Check auth status on mount and location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]); // Re-check when route changes

  // Set up periodic auth checking (lightweight solution)
  useEffect(() => {
    checkAuthStatus();
    
    // Check auth status every 2 seconds (you can adjust this interval)
    const authCheckInterval = setInterval(checkAuthStatus, 2000);
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      console.log('Auth change event received');
      checkAuthStatus();
    };

    // Listen for focus events (when user comes back to tab)
    const handleFocus = () => {
      checkAuthStatus();
    };

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]); // Include isAuthenticated in dependency to avoid stale closures

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (isHomePage) {
        const sections = ['services', 'projects', 'contact'];
        const currentSection = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        setActiveSection(currentSection || '');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', href: '/', type: 'route' },
    { name: 'Services', href: '#services', type: 'section' },
    { name: 'Projects', href: '#projects', type: 'section' },
    { name: 'Results', href: '/results', type: 'route' },
    { name: 'Contact', href: '#contact', type: 'section' },
  ];

  const handleNavigation = (item) => {
    if (item.type === 'route') {
      navigate(item.href);
    } else {
      if (!isHomePage) {
        navigate('/');
        setTimeout(() => scrollToSection(item.href), 100);
      } else {
        scrollToSection(item.href);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const isNavItemActive = (item) => {
    if (item.type === 'route') {
      return location.pathname === item.href;
    } else {
      return (
        activeSection === item.href.replace('#', '') ||
        (item.href === '#home' && activeSection === '' && isHomePage)
      );
    }
  };

  const handleLogin = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout initiated');
    
    // Clear auth cookies
    document.cookie = 'access_token=;path=/;max-age=0';
    document.cookie = 'refresh_token=;path=/;max-age=0';
    document.cookie = 'token_type=;path=/;max-age=0';
    
    // Immediately update state
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('auth-changed'));
    
    console.log('Logout completed, redirecting...');
    
    // Use navigate with replace instead of window.location for better UX
    navigate('/', { replace: true });
    
    // Alternative: Force refresh only if you're still having issues
    // window.location.href = "/";
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsMobileMenuOpen(false);
  };

  const isTransparent = isHomePage && !isScrolled;

  // Debug logging (remove in production)
  console.log('Header render - isAuthenticated:', isAuthenticated);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-gray-900'
                }`}
              >
                Devanjali
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isTransparent ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Construction
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                  isNavItemActive(item)
                    ? isTransparent
                      ? 'text-yellow-400'
                      : 'text-yellow-500'
                    : isTransparent
                      ? 'text-white hover:text-yellow-400'
                      : 'text-gray-700 hover:text-yellow-500'
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform duration-300 ${
                    isNavItemActive(item)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Desktop CTA and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboard}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isTransparent
                      ? 'text-white hover:text-yellow-400 hover:bg-white/10'
                      : 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10'
                  }`}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isTransparent
                      ? 'text-white hover:text-red-400 hover:bg-white/10'
                      : 'text-gray-700 hover:text-red-500 hover:bg-red-50/10'
                  }`}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isTransparent
                    ? 'text-white hover:text-yellow-400 hover:bg-white/10'
                    : 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10'
                }`}
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}
            
            <button
              onClick={() =>
                handleNavigation({ href: '#contact', type: 'section' })
              }
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                isTransparent
                  ? 'bg-transparent hover:bg-yellow-500 text-white hover:text-gray-900 border-white hover:border-yellow-500'
                  : 'bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 border-gray-900'
              }`}
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isTransparent ? 'text-white' : 'text-gray-900'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            className={`py-4 space-y-2 ${
              isTransparent ? 'bg-gray-900/95' : 'bg-white'
            } backdrop-blur-md rounded-lg mt-2 border border-gray-200/20`}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`block w-full text-left px-6 py-3 transition-colors duration-300 ${
                  isNavItemActive(item)
                    ? 'text-yellow-500 bg-yellow-50/10'
                    : isTransparent
                      ? 'text-white hover:text-yellow-400 hover:bg-white/10'
                      : 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10'
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="px-6 pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isTransparent
                        ? 'text-white hover:text-yellow-400 hover:bg-white/10'
                        : 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10'
                    }`}
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isTransparent
                        ? 'text-white hover:text-red-400 hover:bg-white/10'
                        : 'text-gray-700 hover:text-red-500 hover:bg-red-50/10'
                    }`}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isTransparent
                      ? 'text-white hover:text-yellow-400 hover:bg-white/10'
                      : 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10'
                  }`}
                >
                  <User size={18} />
                  <span>Login</span>
                </button>
              )}
              
              <button
                onClick={() =>
                  handleNavigation({ href: '#contact', type: 'section' })
                }
                className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                  isTransparent
                    ? 'bg-transparent hover:bg-yellow-500 text-white hover:text-gray-900 border-white hover:border-yellow-500'
                    : 'bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 border-gray-900'
                }`}
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;