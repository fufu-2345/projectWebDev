import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link className="text-2xl font-bold" href="/">
          Navbar for normal user
        </Link>

        {/* Toggle Button for mobile */}
        <button
          className="lg:hidden p-2 rounded-md text-white hover:text-gray-300"
          type="button"
          aria-label="Toggle navigation"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Navbar links */}
        <div className="hidden lg:flex space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                className="text-white hover:text-gray-300"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Logout
              </button>
            </li>
            <li>
              <Link className="text-white hover:text-gray-300" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-white hover:text-gray-300" href="/auth">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
