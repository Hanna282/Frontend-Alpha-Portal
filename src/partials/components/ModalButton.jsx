import React from 'react'

const ModalButton = ({type, text, onClick}) => {

    return (
        <button 
            type="button" 
            data-modal="true" 
            className={`btn btn-${type}`}
            onClick={onClick}>
            <span>{text}</span>
        </button>
    )
}

export default ModalButton