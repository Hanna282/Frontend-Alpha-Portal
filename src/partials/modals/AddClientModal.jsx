import React, { useRef, useState } from 'react'
import { useClients } from '../../contexts/ClientsContext';

const AddClientModal = ({ onClose }) => {
    const [imagePreview, setImagePreview] = useState(null)
    const fileUploadRef = useRef(null)
    const { addClient } = useClients()
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState()
    const [form, setForm] = useState({
        imageFileName: null,
        clientName: '',
        email: '',
        phone: '',
        streetName: '',
        postalCode: '',
        city: '',
        reference: ''
    })

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "clientName":
                if (!value)
                    error = "Client name is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "email":
                if (!value)
                    error = "Email is required.";
                else if (value.length < 5)
                    error = "Must be at least 5 characters.";
                else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
                    error = "Invalid email format.";
                break;
            case "streetName":
                if (!value)
                    error = "Street name  is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "postalCode":
                if (!value)
                    error = "Postal Code is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "city":
                if (!value)
                    error = "City is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
    }

    const validateForm = () => {
        const newErrors = {};

        if (!form.clientName)
            newErrors.clientName = "Client name is required.";
        else if (form.clientName.length < 2)
            newErrors.clientName = "Must be at least 2 characters.";

        if (!form.email)
            newErrors.email = "Email is required.";
        else if (form.email.length < 5)
            newErrors.email = "Must be at least 5 characters.";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
            newErrors.email = "Invalid email format.";

        if (!form.streetName)
            newErrors.streetName = "Street name is required.";
        else if (form.streetName.length < 2)
            newErrors.streetName = "Must be at least 2 characters.";

        if (!form.postalCode)
            newErrors.postalCode = "Postal Code is required.";
        else if (form.postalCode.length < 2)
            newErrors.postalCode = "Must be at least 2 characters.";

        if (!form.city)
            newErrors.city = "City is required.";
        else if (form.city.length < 2)
            newErrors.city = "Must be at least 2 characters.";

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            setForm(prev => ({ ...prev, imageFileName: files[0] }))
            setImagePreview(URL.createObjectURL(files[0]))
        }
        else {
            setForm(prev => ({ ...prev, [name]: value }))
        }

        validateField(name, value)
    }

    const handleFileClick = (e) => {
        e.preventDefault()
        fileUploadRef.current.click()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm())
            return;

        const formData = new FormData()
        if (form.imageFileName)
            formData.append("ImageFileName", form.imageFileName)
        formData.append("ClientName", form.clientName)
        formData.append("Email", form.email)
        formData.append("Phone", form.phone || '')
        formData.append("StreetName", form.streetName)
        formData.append("PostalCode", form.postalCode)
        formData.append("City", form.city)
        formData.append("Reference", form.reference || '')

        const result = await addClient(formData)
        if (!result.success) {
            setErrorMessage(result.message?.message)
            return
        }
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="form" noValidate encType="multipart/form-data">
            <div className="form-group">
                <div className="image-preview-container user-image" onClick={handleFileClick}>
                    {imagePreview ? (
                        <img id="image-preview" src={imagePreview} alt="Image preview" />
                    ) : (
                        <div id="image-preview-icon" className="circle circle-gray">
                            <i className="fa-duotone fa-solid fa-camera"></i>
                        </div>
                    )}
                </div>
                <input type="file" accept="image/*" name="imageFileName" className="hide" ref={fileUploadRef} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label">Client Name</label>
                <input
                    type="text"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    className={`form-input ${errors.clientName ? 'input-validation-error' : ''}`}
                    placeholder="Enter Client name"
                    required
                />
                {errors.clientName && <span className="field-validation-error">{errors.clientName}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'input-validation-error' : ''}`}
                    placeholder="Enter email address"
                    required
                />
                {errors.email && <span className="field-validation-error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'input-validation-error' : ''}`}
                    placeholder="Enter phone number"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Address</label>
                <input
                    name="streetName"
                    type="text"
                    value={form.streetName}
                    onChange={handleChange}
                    className={`form-input ${errors.streetName ? 'input-validation-error' : ''}`}
                    placeholder="Enter street address"
                    required
                />
                {errors.streetName && <span className="field-validation-error">{errors.streetName}</span>}
            </div>
            <div className="form-horizontal-group">
                <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        className={`form-input ${errors.postalCode ? 'input-validation-error' : ''}`}
                        placeholder="Enter postal code"
                        required
                    />
                    {errors.postalCode && <span className="field-validation-error">{errors.postalCode}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={`form-input ${errors.city ? 'input-validation-error' : ''}`}
                        placeholder="Enter city"
                        required
                    />
                    {errors.city && <span className="field-validation-error">{errors.city}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Billing Reference</label>
                <input
                    name="reference"
                    type="text"
                    value={form.reference}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter billing reference"
                />
            </div>
            {errorMessage && (<div className="error-message-portal">{errorMessage}</div>)}
            <button type="submit" className="btn btn-submit">Create</button>
        </form>
    )
}

export default AddClientModal