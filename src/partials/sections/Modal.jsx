import React from 'react'

const Modal = ( {title, children, onClose}) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="btn-close" onClick={onClose} >
                        <i className="fa-light fa-times"></i> 
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}

export default Modal