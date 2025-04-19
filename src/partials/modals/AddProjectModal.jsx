import { useRef, useState } from "react"
import { useProjects } from "../../contexts/ProjectsContext";

const AddProjectModal = ({ onClose, clients = [], members = [] }) => {
    const [imagePreview, setImagePreview] = useState(null)
    const fileUploadRef = useRef(null)
    const { addProject } = useProjects()
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState()
    const [form, setForm] = useState({
        imageFileName: null,
        projectName: '',
        clientId: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        userId: ''
    })

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "projectName":
                if (!value)
                    error = "Project name is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "clientId":
                if (!value)
                    error = "Client is required.";
                break;
            case "userId":
                if (!value)
                    error = "Project owner is required.";
                break;
            case "startDate":
                if (!value)
                    error = "Start date is required.";
                break;
            case "endDate":
                if (!value)
                    error = "End date is required.";
                break;
            case "budget":
                if (value && !/^\d+(\.\d{1,2})?$/.test(value))
                    error = "Must be a valid number.";
                else if (parseFloat(value) < 0)
                    error = "Cannot be negative.";
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
    }

    const validateForm = () => {
        const newErrors = {};

        if (!form.projectName)
            newErrors.projectName = "Project name is required.";
        else if (form.projectName.length < 2)
            newErrors.projectName = "Must be at least 2 characters.";

        if (!form.clientId)
            newErrors.clientId = "Client is required.";

        if (!form.userId)
            newErrors.userId = "Project owner is required.";

        if (!form.startDate)
            newErrors.startDate = "Start date is required.";

        if (!form.endDate)
            newErrors.endDate = "End date is required.";

        if (form.budget && !/^\d+(\.\d{1,2})?$/.test(form.budget))
            newErrors.budget = "Must be a valid number.";
        else if (parseFloat(form.budget) < 0)
            newErrors.budget = "Cannot be negative.";

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
            return

        const formData = new FormData()
        if (form.imageFileName)
            formData.append("ImageFileName", form.imageFileName)
        formData.append("ProjectName", form.projectName)
        formData.append("ClientId", form.clientId)
        formData.append("Description", form.description || '')
        formData.append("StartDate", form.startDate)
        formData.append("EndDate", form.endDate)
        formData.append("Budget", form.budget)
        formData.append("UserId", form.userId)

        const result = await addProject(formData)
        if (!result.success) {
            setErrorMessage(result.message?.message)
            return
        }
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="form" noValidate encType="multipart/form-data">
            <div className="form-group">
                <div className="image-preview-container project-image" onClick={handleFileClick}>
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
                <label className="form-label">Project Name</label>
                <input
                    type="text"
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    className={`form-input ${errors.projectName ? 'input-validation-error' : ''}`}
                    placeholder="Enter project name"
                    required
                />
                {errors.projectName && <span className="field-validation-error">{errors.projectName}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Client Name</label>
                <div className="form-select">
                    <select
                        name="clientId"
                        value={form.clientId}
                        className={`form-input ${errors.clientId ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required >
                        <option value="" >Select client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id} className="form-select-option">
                                {client.clientName}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.clientId && <span className="field-validation-error">{errors.clientId}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Type something" />
            </div>
            <div className="form-horizontal-group">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className={`form-input ${errors.startDate ? 'input-validation-error' : ''}`}
                        type="date"
                        required
                    />
                    {errors.startDate && <span className="field-validation-error">{errors.startDate}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className={`form-input ${errors.endDate ? 'input-validation-error' : ''}`}
                        type="date" />
                    {errors.endDate && <span className="field-validation-error">{errors.endDate}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Project Owner</label>
                <div className="form-select">
                    <select
                        name="userId"
                        value={form.memberId}
                        className={`form-input ${errors.clientId ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required >
                        <option value="">Select project owner</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id} className="form-select-option">
                                {member.information.firstName} {member.information.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.endDate && <span className="field-validation-error">{errors.endDate}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Budget</label>
                <div className="form-input-extendend">
                    <i className="fa-duotone fa-solid fa-dollar-sign"></i>
                    <input
                        type="text"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className={`form-input ${errors.budget ? 'input-validation-error' : ''}`}
                        placeholder="0"
                    />
                </div>
                {errors.budget && <span className="field-validation-error">{errors.budget}</span>}
            </div>
            {errorMessage && (<div className="error-message-portal">{errorMessage}</div>)}
            <button type="submit" className="btn btn-submit">Create</button>
        </form>
    )
}

export default AddProjectModal