import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/projectlogo2.webp"; 

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="bg-blue-800 text-white p-4 shadow-md"> {/* Changed header background color to blue */}
      <div className="flex justify-between items-center">
        
        {/* Left Section: Logo and Header Text */}
        <div className="flex items-center space-x-4">
          <img 
            src={logo}  // Using imported logo
            alt="Logo" 
            className="w-24 h-24"  // Increased size here
          /> {/* Logo */}
          <h1 className="text-2xl font-bold">Project Management</h1>
        </div>

        {/* Right Section: Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-gray-400">Contact Us</Link>
            </li>
            {isAuthenticated && (
              <li>
                <button onClick={onLogout} className="hover:text-gray-400">Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;










