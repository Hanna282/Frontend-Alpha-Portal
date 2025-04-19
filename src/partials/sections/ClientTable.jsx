import React, { useState } from 'react'
import AvatarGrayOrange from '../../assets/images/avatars/avatar-woman-gray-orange.svg'

const ClientTable = ({ client, onEditClick, onDeleteClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const clientImage = client.imageFileName ? client.imageFileName : AvatarGrayOrange;

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev)

    const handleEditClick = (client) => {
        onEditClick(client)
        setIsDropdownOpen(false)
    }

    const handleDeleteClick = () => {
        onDeleteClick(client.id)
        setIsDropdownOpen(false)
    }

    return (
        <tr>
            <td><input type="checkbox" /></td>
            <td>
                <div className="client-info">
                    <img src={clientImage} alt="client" className="client-image" />
                    <div className="client-text">
                        <p className="name">{client.clientName}</p>
                        <p className="email">{client.information.email}</p>
                    </div>
                </div>
            </td>
            <td>{client.address.city}</td>
            <td>{client.information?.phone || "-"}</td>
            <td>{new Date(client.created).toLocaleDateString()}</td>{/* Tagit hjälp av AI för datum hanteringen */}
            <td>
                <span className={`status ${client.isActive ? 'active' : 'inactive'}`}>
                    {client.isActive ? "Active" : "Inactive"}
                </span>
            </td>
            <td>
                <div id="client-actions-container">
                    <button type="button" className="btn-action" onClick={toggleDropdown}>
                        <i id="dots" className="fa-solid fa-ellipsis"></i>
                    </button>
                    {isDropdownOpen && (
                        <div id="project-dropdown" className="dropdown">
                            <div className="dropdown-body">
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action edit" onClick={() => handleEditClick(client)}>
                                        <i className="fa-duotone fa-solid fa-pen-to-square"></i>
                                        <span>Edit</span>
                                    </button>
                                </nav>
                                <nav className="dropdown-actions">
                                    <button className="dropdown-action remove" onClick={handleDeleteClick} >
                                        <i className="fa-duotone fa-solid fa-trash"></i>
                                        <span>Delete Client</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default ClientTable