import constructionImage from '../assets/construction.jpg';

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 80; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };
  return (
    <section id="home" className="relative h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={constructionImage} 
          alt="Construction site" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
      </div>
      
      {/* Content container */}
      <div className="relative h-full container mx-auto px-6 flex items-center">
        {/* Left column - Text content */}
        <div className="flex-1 z-10 pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-yellow-400 mb-2">Devanjali</span>
            Construction Private Limited
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-2xl text-gray-300">
            Building <span className="text-yellow-400 font-medium">your vision</span>, one brick at a time
          </p>
          <div className="flex space-x-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105" onClick={() => scrollToSection("#contact")}>
              Get a Quote
            </button>
            <button className="border-2 border-white hover:border-yellow-400 hover:text-yellow-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105" onClick={() => scrollToSection("#projects")}>
              Our Projects
            </button>
          </div>
        </div>
        
        {/* Right column - Age badge */}
        <div className="hidden lg:flex flex-1 items-center justify-center z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-64 h-64 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-6xl font-bold text-yellow-400">2</span>
              <span className="text-xl text-white mt-2">Years of Excellence</span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-yellow-400/50 blur-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;