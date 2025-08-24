import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa'
import './Navbar.css'

export default function Navbar({ cartCount = 0, user, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img src="/Logo.png" alt="Logo" className="navbar-logo" />
        Blooming Barrels
      </NavLink>
    <div className="navbar-links navbar-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          Home
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          Shop
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          Blog
        </NavLink>
        <NavLink
          to="/templates"
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          Design
        </NavLink>
      </div>
      <div className="navbar-account-actions">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/account-overview"
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}
              title="Account Overview"
            >
              <FaUser style={{ fontSize: '1.15em' }} />
              Account
            </NavLink>
            <button
              onClick={onLogout}
              className="navbar-link logout-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4em', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <FaSignOutAlt style={{ fontSize: '1.15em' }} />
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  )
}
