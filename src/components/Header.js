import React, { useState, useContext, useEffect } from 'react';
import logo from '../images/logo.png';
import menuIcon from '../images/Icons/menu.png';
import closeIcon from '../images/Icons/close-icon.png';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';

const Header = ({ isAuthenticated, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && menuOpen) {
      setMenuOpen(false);
    }
  }, [isAuthenticated, menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = () => {
    onLogout();
    setMenuOpen(false);
    navigate('/signin');
  };

  return (
    <header className="header">
      {menuOpen && isAuthenticated && (
        <div className="header__dropdown">
          <span className="header__email">{currentUser.email}</span>
          <a href="#signout" onClick={handleSignOut} className="header__logout">Cerrar Sesión</a>
        </div>
      )}
      <div className="header__top-row">
        <img src={logo} alt="Logo" className="header__logo" />
        {isAuthenticated && windowWidth < 950 && (
          <img
            src={menuOpen ? closeIcon : menuIcon}
            alt="Menu"
            className="header__menu-icon"
            onClick={toggleMenu}
          />
        )}
        {isAuthenticated && windowWidth >= 950 && (
          <div className='header__menu-large'>
            <span className="header__email">{currentUser.email}</span>
            <a href="#signout" onClick={handleSignOut} className="header__logout">Cerrar Sesión</a>
          </div>
        )}
        {!isAuthenticated && windowWidth < 950 && (
          <div className='header__menu-small'>
            {location.pathname === '/signin' && (
              <Link to="/signup" className="header__link">Regístrate</Link>
            )}
            {location.pathname === '/signup' && (
              <Link to="/signin" className="header__link">Inicia sesión</Link>
            )}
          </div>
        )}
      </div>
      {!isAuthenticated && windowWidth >= 950 && (
        <div className='header__menu-large'>
          {location.pathname === '/signin' && (
            <Link to="/signup" className="header__link">Regístrate</Link>
          )}
          {location.pathname === '/signup' && (
            <Link to="/signin" className="header__link">Inicia sesión</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
