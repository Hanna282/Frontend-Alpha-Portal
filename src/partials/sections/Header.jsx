import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import AvatarImage from '../../assets/images/avatars/avatar-man-orange-purple.svg';
import { useMembers } from '../../contexts/MembersContext';

const Header = () => {
  const { signOut } = useAuth()
  const { signedInMember } = useMembers()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark")

  const baseImageUrl = "https://localhost:7095/images"
  const avatar = signedInMember.imageFileName ? `${baseImageUrl}/${signedInMember.imageFileName}`: AvatarImage;
  const name = signedInMember.information ? `${signedInMember.information.firstName} ${signedInMember.information.lastName}`: "Förnamn Efternamn";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const handleSignOut = () => {
    signOut()
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("theme", newMode ? "dark" : "light")
  }

  return (
    <header id="header" className="header">
      <div id="account-container">
        <button type="button" className="btn-account" onClick={toggleDropdown} >
          <img src={avatar} alt="avatar" />
        </button>
        {isDropdownOpen && (
          <div className="dropdown">
            <div className="dropdown-header">
              <div className="account-name">
                <img src={avatar} alt="avatar" />
                <span>{name}</span>
              </div>
            </div>
            <div className="dropdown-body">
              <nav className="dropdown-options">
                <div className="dropdown-option">
                  <label className="switch-label">
                    <i className="fa-duotone fa-solid fa-cog"></i>
                    <span>Dark Mode</span>
                  </label>
                  <label className="switch">
                    <input type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
                    <span className="slider"></span>
                  </label>
                </div>
              </nav>
              <div className="divider"></div>
              <nav className="dropdown-actions">
                <button className="dropdown-action" onClick={handleSignOut}>
                  <i className="fa-duotone fa-solid fa-right-from-bracket"></i>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header