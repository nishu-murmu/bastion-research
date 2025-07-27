import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="https://bastionresearch.in/wp-content/uploads/2023/03/BASTION-RESEARCH-_-logo-min-e1680501100187-190x45.png"
                alt="Bastion Research"
                className="h-14"
              />
            </Link>
          </div>
          <nav
            className="hidden md:flex items-center space-x-10"
            itemtype="https://schema.org/SiteNavigationElement"
            itemscope
          >
            <Link
              to="/"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium text-lg"
              itemprop="name"
            >
              Home
            </Link>
            <Link
              to="/bastion-core"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium text-lg"
              itemprop="name"
            >
              Bastion CORE
            </Link>

            {/* Knowledge Center with dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 transition-colors font-medium text-lg flex items-center">
                Knowledge Center
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden group-hover:block z-10">
                <Link
                  to="/newsletters-archive"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Newsletters Archive
                </Link>
                <Link
                  to="/podcast"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Podcast (MADE IN INDIA)
                </Link>
                <Link
                  to="/webinars"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Webinars
                </Link>
              </div>
            </div>

            <Link
              to="/login"
              className="text-gray-700 hover:text-red-600 flex items-center transition-colors font-medium text-lg"
            >
              <span className="mr-2">👤</span> Login
            </Link>
            <Link
              to="/contact"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors font-medium text-lg"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
