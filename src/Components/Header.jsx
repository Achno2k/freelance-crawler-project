import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['services', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      setActiveSection(currentSection || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
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
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Devanjali
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Construction
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                  activeSection === item.href.replace('#', '') || 
                  (item.href === '#home' && activeSection === '')
                    ? isScrolled 
                      ? 'text-yellow-500' 
                      : 'text-yellow-400'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-yellow-500' 
                      : 'text-white hover:text-yellow-400'
                }`}
              >
                {item.name}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform duration-300 ${
                    activeSection === item.href.replace('#', '') || 
                    (item.href === '#home' && activeSection === '')
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('#contact')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                isScrolled
                  ? 'bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 border-gray-900'
                  : 'bg-transparent hover:bg-yellow-500 text-white hover:text-gray-900 border-white hover:border-yellow-500'
              }`}
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
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
          <div className={`py-4 space-y-2 ${
            isScrolled ? 'bg-white/95' : 'bg-gray-900/95'
          } backdrop-blur-md rounded-lg mt-2 border border-gray-200/20`}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-6 py-3 transition-colors duration-300 ${
                  activeSection === item.href.replace('#', '') || 
                  (item.href === '#home' && activeSection === '')
                    ? 'text-yellow-500 bg-yellow-50/10'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-yellow-500 hover:bg-yellow-50/10' 
                      : 'text-white hover:text-yellow-400 hover:bg-white/10'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="px-6 pt-2">
              <button
                onClick={() => scrollToSection('#contact')}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                  isScrolled
                    ? 'bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 border-gray-900'
                    : 'bg-transparent hover:bg-yellow-500 text-white hover:text-gray-900 border-white hover:border-yellow-500'
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