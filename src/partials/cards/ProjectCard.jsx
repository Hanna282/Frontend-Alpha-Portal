import React, { useState } from 'react'
import IconRadialBlue from '../../assets/images/projects/Icon_radial_blue.svg' 

const ProjectCard = ({ project, onEditClick,  onDeleteClick}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const imageBaseUrl = 'https://localhost:7095/images/';
    const projectImage = project.imageFileName ? `${imageBaseUrl}${project.imageFileName}` : IconRadialBlue 

    // Tagit hjälp av AI gällande normalisering av datumen
    const normalizeDate = (date) => {
        const normalized = new Date(date)
        normalized.setHours(0, 0, 0, 0)
        return normalized
    }

    const today = normalizeDate(new Date())
    const endDate = normalizeDate(new Date(project.endDate))
    const aDayInMs = 24 * 60 * 60 * 1000
    const daysDiff = Math.round((endDate-today) / aDayInMs)
    const weeksDiff = Math.round(daysDiff / 7)

    let badgeClass = 'badge-normal'
    let badgeText = `${weeksDiff} week${weeksDiff !== 1 ? 's' : ''} left` 

    if (daysDiff < 1) {
        badgeClass = 'badge-danger'
        badgeText = `Overdue`
    } 
    else if (daysDiff === 1) {
        badgeClass = 'badge-danger'
        badgeText = `${daysDiff} days left`
    } 
    else if (daysDiff <= 6) {
        badgeClass = 'badge-warning'
        badgeText = `${daysDiff} days left`
    }

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev)

    const handleEditClick = (project) => {
        onEditClick(project)
        setIsDropdownOpen(false)
    }

    const handleDeleteClick = () => {
        onDeleteClick(project.id)
        setIsDropdownOpen(false)
    }

    return (
        <div className="project card">
            <div className="card-header">
                <div className="project-image">
                    <img src={projectImage} alt="Project Image" />
                </div>
                <h6 className="project-name">{project.projectName}</h6> 
                <span className="client-name">{project.client.clientName}</span>  
                <div id="project-actions-container">
                    <button type="button" className="btn-action" onClick={toggleDropdown}>
                        <i id="dots" className="fa-solid fa-ellipsis"></i>
                    </button>
                    {isDropdownOpen && (
                        <div id="project-dropdown" className="dropdown">
                            <div className="dropdown-body">
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action edit" onClick={() => handleEditClick(project)} >
                                        <i className="fa-duotone fa-solid fa-pen-to-square"></i>
                                        <span>Edit</span>
                                    </button>
                                </nav>
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action remove" onClick={handleDeleteClick} href="#">
                                        <i className="fa-duotone fa-solid fa-trash"></i>
                                        <span>Delete Project</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="card-body">
            <p>{project.description || ''}</p> 
            </div>
            <div className="card-footer">
                <div className={`badge ${badgeClass}`}>
                    <i className="fa-duotone fa-solid fa-clock"></i>
                    <span>{badgeText}</span>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard