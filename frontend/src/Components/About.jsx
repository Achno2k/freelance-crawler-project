import aboutImage from '../assets/construction.jpg'; 

const AboutUs = () => {
  return (
    <section id="about" className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-yellow-400/10 -skew-x-12 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-64 bg-gray-900/5 rotate-12 translate-x-1/4"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-yellow-500 font-medium mb-3">WHO WE ARE</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Building <span className="text-yellow-500">Trust</span> Since 2005
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image with frame effect */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={aboutImage} 
                alt="Our team at work" 
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-yellow-400/50 rounded-xl z-0"></div>
          </div>
          
          {/* Text content */}
          <div className="lg:w-1/2">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 relative pb-4">
                Our Story
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-yellow-400"></span>
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Founded in 2005, Devanjali Construction has grown from a small local contractor to a leading regional construction company. 
                Our commitment to quality and customer satisfaction has been the cornerstone of our success, delivering over 200 projects 
                with excellence and precision.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </span>
                    Our Vision
                  </h4>
                  <p className="text-gray-600 pl-11">
                    To be the most trusted construction partner by delivering exceptional quality, innovative solutions, 
                    and outstanding value to our clients across India.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </span>
                    Our Mission
                  </h4>
                  <p className="text-gray-600 pl-11">
                    We are dedicated to constructing high-quality buildings through superior craftsmanship, 
                    sustainable practices, and collaborative partnerships that stand the test of time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;