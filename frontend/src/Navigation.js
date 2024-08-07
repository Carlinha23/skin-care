import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavItem } from 'reactstrap';
import { UserContext } from './UserContext';
import './Navigation.css';
import logo from './images/logo.png';

function NavBar() {
  const { currentUser, logout } = useContext(UserContext);

  return (
    <Navbar expand="md" className="navbar-custom">
      <NavLink exact to="/" className="navbar-brand-custom">
      <img src={logo} alt="SkinCare Review Logo" className="navbar-logo" />
      </NavLink>
      <div className="nav-items-left">
        {currentUser ? (
          <>
            <NavItem className="nav-item">
              <NavLink to="/reviews" className="nav-link-custom">Reviews</NavLink>
            </NavItem>
            <NavItem className="nav-item">
              <NavLink to="/profile" className="nav-link-custom">Hi, {currentUser.username}</NavLink>
            </NavItem>
            <NavItem className="nav-item">
              <NavLink to="/" onClick={logout} className="nav-link-custom">Logout</NavLink>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem className="nav-item">
              <NavLink to="/reviews" className="nav-link-custom">Reviews</NavLink>
            </NavItem>
            <NavItem className="nav-item">
              <NavLink to="/login" className="nav-link-custom">Login</NavLink>
            </NavItem>
            <NavItem className="nav-item">
              <NavLink to="/signup" className="nav-link-custom">Sign up</NavLink>
            </NavItem>
          </>
        )}
      </div>
    </Navbar>
  );
}


export default NavBar;
