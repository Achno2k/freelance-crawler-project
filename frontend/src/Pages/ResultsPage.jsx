import { useState, useEffect } from 'react';
import { Building, MapPin, IndianRupee, Calendar, User, Phone, Mail, FileText, ExternalLink } from 'lucide-react';
import { fetchProjectResults } from '../utils/resultsAPI';

const ResultsPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching the data from the frontend")
        const result = await fetchProjectResults();
        console.log("got the data from the frontend")
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ProjectCard = ({ project, index }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Building className="w-5 h-5" />
            {project.project_name || `Project ${index + 1}`}
          </h3>
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Building className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold text-gray-800">{project.department || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-800">{project.location || 'Not specified'}</p>
            </div>
          </div>

          {project.budget && (
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-green-700">{formatCurrency(project.budget)}</p>
              </div>
            </div>
          )}

          {project.deadline && (
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-semibold text-gray-800">{project.deadline}</p>
              </div>
            </div>
          )}
        </div>

        {/* Handle contact_info - check if it's an object or string */}
        {project.contact_info && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="space-y-2">
              {typeof project.contact_info === 'object' ? (
                <>
                  {project.contact_info.person && (
                    <p className="text-sm"><span className="font-medium">Person:</span> {project.contact_info.person}</p>
                  )}
                  {project.contact_info.office && (
                    <p className="text-sm"><span className="font-medium">Office:</span> {project.contact_info.office}</p>
                  )}
                  {project.contact_info.phone && (
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span className="font-medium">Phone:</span> {project.contact_info.phone}
                    </p>
                  )}
                  {project.contact_info.email && (
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="font-medium">Email:</span> {project.contact_info.email}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-700">{project.contact_info}</p>
              )}
            </div>
          </div>
        )}

        {project.requirements && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Requirements
            </h4>
            {Array.isArray(project.requirements) ? (
              <ul className="space-y-2">
                {project.requirements.map((req, reqIndex) => (
                  <li key={reqIndex} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    {req}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-700">{project.requirements}</p>
            )}
          </div>
        )}

        {project.extracted_at && (
          <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            Extracted: {new Date(project.extracted_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchProjectResults();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="text-lg font-medium text-gray-700">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20">
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allProjects = Object.entries(data).flatMap(([source, projects]) => 
    projects.map(project => ({ ...project, sourceUrl: source }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="pt-20">
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        {/* Header */}
        <div className="bg-white shadow-md border-b border-gray-200 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Project Results Dashboard</h1>
                  {/* <p className="text-sm text-gray-600"></p> */}
                </div>
              </div>
              <div className="bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-gray-800">
                  {allProjects.length} Projects Found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {allProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h2>
                <p className="text-gray-600">No project data is available at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(data).map(([source, projects]) => (
                <div key={source} className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-lg">
                        <ExternalLink className="w-5 h-5 text-gray-800" />
                      </div>
                      Source: {source}
                    </h2>
                    <p className="text-gray-600">{projects.length} projects from this source</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <ProjectCard key={index} project={project} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default ResultsPage;