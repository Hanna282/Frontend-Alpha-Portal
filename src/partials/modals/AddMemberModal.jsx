import React, { useRef, useState } from 'react'
import { useMembers } from '../../contexts/MembersContext';

const AddMemberModal = ({ onClose }) => {
    const [imagePreview, setImagePreview] = useState(null)
    const fileUploadRef = useRef(null);
    const { roles, addMember } = useMembers()
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState()
    const [form, setForm] = useState({
        imageFileName: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        role: '',
        streetName: '',
        postalCode: '',
        city: ''
    })

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "firstName":
                if (!value)
                    error = "First name is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "lastName":
                if (!value)
                    error = "Last name is required.";
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
            case "jobTitle":
                if (!value)
                    error = "Job title is required.";
                break;
            case "role":
                if (!value)
                    error = "Role is required.";
                break;
            case "streetName":
                if (!value)
                    error = "Street name is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "postalCode":
                if (!value)
                    error = "Postal Code  is required.";
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

        if (!form.firstName)
            newErrors.firstName = "First name is required.";
        else if (form.firstName.length < 2)
            newErrors.firstName = "Must be at least 2 characters.";

        if (!form.lastName)
            newErrors.lastName = "Last name is required.";
        else if (form.lastName.length < 2)
            newErrors.lastName = "Must be at least 2 characters.";

        if (!form.email)
            newErrors.email = "Email is required.";
        else if (form.email.length < 5)
            newErrors.email = "Must be at least 5 characters.";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
            newErrors.email = "Invalid email format.";

        if (!form.jobTitle)
            newErrors.jobTitle = "Job title is required.";

        if (!form.role)
            newErrors.role = "Role is required.";

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

        if (!validateForm()) return;

        const formData = new FormData()
        if (form.imageFileName)
            formData.append("ImageFileName", form.imageFileName)
        formData.append("FirstName", form.firstName)
        formData.append("LastName", form.lastName)
        formData.append("Email", form.email)
        formData.append("Phone", form.phone || '')
        formData.append("JobTitle", form.jobTitle)
        formData.append("Role", form.role)
        formData.append("StreetName", form.streetName)
        formData.append("PostalCode", form.postalCode)
        formData.append("City", form.city)

        const result = await addMember(formData)
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
            <div className="form-horizontal-group">
                <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'input-validation-error' : ''}`}
                        placeholder="Enter first name"
                        required
                    />
                    {errors.firstName && <span className="field-validation-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className={`form-input ${errors.lastName ? 'input-validation-error' : ''}`}
                        placeholder="Enter last name"
                        required
                    />
                    {errors.lastName && <span className="field-validation-error">{errors.lastName}</span>}
                </div>
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
                <label className="form-label">Job Title</label>
                <input
                    name="jobTitle"
                    type="text"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className={`form-input ${errors.jobTitle ? 'input-validation-error' : ''}`}
                    placeholder="Enter job title"
                    required
                />
                {errors.jobTitle && <span className="field-validation-error">{errors.jobTitle}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Member Role</label>
                <div className="form-select">
                    <select
                        name="role"
                        value={form.role}
                        className={`form-input ${errors.role ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required>
                        <option value="">Select member</option>
                        {roles.map(role => (
                            <option key={role} value={role} className="form-select-option">
                                {role}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.role && <span className="field-validation-error">{errors.role}</span>}
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
            {errorMessage && (<div className="error-message-portal">{errorMessage}</div>)}
            <button type="submit" className="btn btn-submit">Add Contact</button>
        </form>
    )
}

export default AddMemberModal