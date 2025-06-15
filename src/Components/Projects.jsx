const projects = [
  {
    title: "Hillside Residential Complex",
    location: "Green Valley, CA",
    description: "A luxury residential complex with 50 units and premium amenities.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Downtown Office Tower",
    location: "Metropolis, NY",
    description: "A 25-story commercial tower with LEED Gold certification.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Riverside Shopping Mall",
    location: "Springfield, IL",
    description: "A 150,000 sq ft retail space with parking for 500 vehicles.",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-64 bg-yellow-400/10 -skew-x-12 -translate-x-1/4"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-yellow-500 font-medium mb-3">OUR PORTFOLIO</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-yellow-500">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <div className="transform group-hover:-translate-y-2 transition duration-300">
                  <p className="text-yellow-400 font-medium text-sm mb-2">{project.location}</p>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-300 mb-6">{project.description}</p>
                  <button className="text-yellow-400 font-medium flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                    View Details
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
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;