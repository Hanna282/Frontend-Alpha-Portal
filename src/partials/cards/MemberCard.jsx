import React, { useState } from 'react'
import AvatarOrangePurple from '../../assets/images/avatars/avatar-man-orange-purple.svg'

const MemberCard = ({ member, onEditClick, onDeleteClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const imageBaseUrl = 'https://localhost:7095/images/';
    const memberImage = member.imageFileName ? `${imageBaseUrl}${member.imageFileName}` : AvatarOrangePurple;

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev)

    const handleEditClick = (member) => {
        onEditClick(member)
        setIsDropdownOpen(false)
    }

    const handleDeleteClick = () => {
        onDeleteClick(member.id)
        setIsDropdownOpen(false)
    }

    return (
        <div className="member card">
            <div className="card-header">
                <div id="member-actions-container">
                    <button type="button" className="btn-action" onClick={toggleDropdown}>
                        <i id="dots" className="fa-solid fa-ellipsis"></i>
                    </button>
                    {isDropdownOpen && (
                        <div id="project-dropdown" className="dropdown">
                            <div className="dropdown-body">
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action edit" onClick={() => handleEditClick(member)}>
                                        <i className="fa-duotone fa-solid fa-pen-to-square"></i>
                                        <span>Edit</span>
                                    </button>
                                </nav>
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action remove" onClick={handleDeleteClick} href="#">
                                        <i className="fa-duotone fa-solid fa-trash"></i>
                                        <span>Delete Member</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="card-body">
                <div className="member-image">
                    <img src={memberImage} alt="member Image" />
                </div>
                <h4 className="member-name">{member.information.firstName} {member.information.lastName}</h4>
                <p className="member-jobTitle">{member.information.jobTitle}</p>
                <div className="member-info">
                    <p>{member.information.email}</p>
                    <p>{member.information.phone}</p>
                    <p className="member-role">{member.information.role}</p>
                </div>
            </div>
        </div>
    )
}

export default MemberCard