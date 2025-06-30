import React from 'react';
import { FaPaw, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-green-100 dark:bg-gray-900 p-4 shadow-sm transition-colors">
      <div className="flex items-center max-w-7xl mx-auto justify-between">
        <div className="flex items-center">
          <FaPaw className="text-3xl text-green-700 dark:text-green-400 transition-colors" />
          <Link to="/" className="text-2xl font-bold text-green-800 dark:text-green-200 ml-3 transition-colors">
            PetAdopt
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-green-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 focus:outline-none group`}
          aria-label="Tema değiştirici"
        >
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
            <FaSun className={`text-yellow-400 text-2xl transition-transform duration-300 ${theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
            <FaMoon className={`text-blue-300 text-2xl transition-transform duration-300 ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
          </span>
          <span className="sr-only">{theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 