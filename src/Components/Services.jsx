import residentialBg from '../assets/residential-bg.jpg';
import commercialBg from '../assets/commercial-bg.jpg';
import projectMgmtBg from '../assets/project-mgmt-bg.jpg';
import renovationsBg from '../assets/renovations.jpeg';
import consultingBg from '../assets/consultations-bg.jpeg';

const services = [
  {
    title: "Residential Construction",
    description: "Custom homes, renovations, and additions tailored to your lifestyle.",
    bgImage: residentialBg
  },
  {
    title: "Commercial Construction",
    description: "Office buildings, retail spaces, and other commercial properties.",
    bgImage: commercialBg
  },
  {
    title: "Project Management",
    description: "Full-service project management from concept to completion.",
    bgImage: projectMgmtBg
  },
  {
    title: "Renovations",
    description: "Transforming existing spaces to meet your current needs.",
    bgImage: renovationsBg
  },
  {
    title: "Consulting",
    description: "Expert advice for your construction projects and investments.",
    bgImage: consultingBg
  }
];

const Services = () => {
  return (
    <section id="services" className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-yellow-400/10 skew-x-12 translate-x-1/4"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-yellow-500 font-medium mb-3">WHAT WE OFFER</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-yellow-500">Services</span>
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img 
                  src={service.bgImage} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <div className="transform group-hover:-translate-y-2 transition duration-300">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <button className="text-yellow-400 font-medium flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                    Learn more
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Accent bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 border-2 border-gray-900">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;