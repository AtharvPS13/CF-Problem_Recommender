import React from 'react'
import './Header.css'
import {NavLink} from 'react-router-dom'

function Header() {

  return (
    <div>
      <nav>
        <div className='containerHeader'>
          <div className='links'>
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              Problems
            </NavLink>
            <NavLink 
              to="/stats" 
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              Stats
            </NavLink>
          </div>
        </div>
      </nav>
      
    </div>
  )
}

export default Header