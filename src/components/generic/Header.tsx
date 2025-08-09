import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Bastion Research
        </Link>
        <nav>
          <Link to="/login" className="mr-4">
            Login
          </Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
