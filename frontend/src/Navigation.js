import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap';
import { UserContext } from './UserContext';
// import './Navigation.css';

function NavBar() {
  const { currentUser, logout } = useContext(UserContext);

  return (
    <Navbar expand="md" className="navbar-custom">
      <NavLink exact to="/" className="navbar-brand-custom">
        Skin-Care Review!
      </NavLink>
      <div className="nav-items-right">
        <Nav className="ml-auto" navbar>
          {currentUser ? (
            <>
              <NavItem>
                <NavLink to="/reviews" className="nav-link-custom">Reviews</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile" className="nav-link-custom">{currentUser.username}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/" onClick={logout} className="nav-link-custom">Logout</NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/reviews" className="nav-link-custom">Reviews</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/login" className="nav-link-custom">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/signup" className="nav-link-custom">Signup</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
}

export default NavBar;
